// load-screen.js
class LoadScreen {
    constructor() {
        this.loadScreen = null;
        this.progressBar = null;
        this.progressPercent = null;
        this.isFirstLoad = true;
        this.init();
    }

    init() {
        this.createLoadScreen();
        this.setupNavigationListeners();
        
        // إظهار شاشة التحميل لمدة 3 ثوانٍ عند التحميل الأولي
        this.show(3000);
        
        // تأخير تهيئة التطبيق حتى انتهاء شاشة التحميل
        this.delayAppInit();
    }

    createLoadScreen() {
        const loadScreenHTML = `
            <div id="load-screen" class="fixed inset-0 bg-oklch z-[9999] flex items-center justify-center transition-opacity duration-500 opacity-0 pointer-events-none">
                <div class="text-center">
                    <div class="mb-8">
                        <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-success flex items-center justify-center shadow-lg">
                            <svg class="w-12 h-12 text-base-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-base-content mb-2">نظام إدارة الموظفين</h2>
                    <p class="text-base-content mb-8">جاري التحميل...</p>
                    
                    <div class="w-64 h-2 bg-neutral rounded-full overflow-hidden mx-auto">
                        <div id="progress-bar" class="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-300 w-0"></div>
                    </div>
                    
                    <div class="mt-4">
                        <span id="progress-percent" class="text-base-content font-medium">0%</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadScreenHTML);
        this.loadScreen = document.getElementById('load-screen');
        this.progressBar = document.getElementById('progress-bar');
        this.progressPercent = document.getElementById('progress-percent');
    }

    setupNavigationListeners() {
        // حفظ الدالة الأصلية
        const originalLoadSection = window.loadSection;
        
        // اعتراض الدالة
        window.loadSection = (sectionName) => {
            this.show(1000); // 1 ثانية للتنقل بين الأقسام
            if (originalLoadSection) {
                // تأخير التنقل الفعلي حتى تنتهي شاشة التحميل
                setTimeout(() => {
                    originalLoadSection(sectionName);
                }, 1000);
            }
        };
    }

    delayAppInit() {
        if (window.App && typeof App.init === 'function') {
            const originalInit = App.init;
            App.init = function() {
                // تأخير التهيئة حتى انتهاء شاشة التحميل
                setTimeout(() => {
                    originalInit.call(this);
                }, 3000);
            };
        }
    }

    show(duration = 3000) {
        if (!this.loadScreen) return;
        
        // إعادة تعيين شريط التقدم
        this.progressBar.style.width = '0%';
        this.progressPercent.textContent = '0%';
        
        // إظهار شاشة التحميل
        this.loadScreen.classList.remove('opacity-0', 'pointer-events-none');
        this.loadScreen.classList.add('opacity-100');
        
        // محاكاة التقدم
        this.animateProgress(duration);
        
        // إخفاء شاشة التحميل بعد المدة المحددة
        setTimeout(() => {
            this.hide();
        }, duration);
        
        // تحديث حالة التحميل الأولي
        if (this.isFirstLoad) {
            this.isFirstLoad = false;
        }
    }

    animateProgress(duration) {
        const startTime = Date.now();
        const endTime = startTime + duration;
        
        const updateProgress = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // تحديث شريط التقدم والنسبة المئوية
            const progressPercent = Math.floor(progress * 100);
            if (this.progressBar) {
                this.progressBar.style.width = `${progressPercent}%`;
            }
            if (this.progressPercent) {
                this.progressPercent.textContent = `${progressPercent}%`;
            }
            
            // الاستمرار في التحديث إذا لم تنته المدة
            if (now < endTime) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        requestAnimationFrame(updateProgress);
    }

    hide() {
        if (!this.loadScreen) return;
        
        // إخفاء شاشة التحميل بسلاسة
        this.loadScreen.classList.remove('opacity-100');
        this.loadScreen.classList.add('opacity-0', 'pointer-events-none');
    }
}

// تهيئة شاشة التحميل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // الانتظار قليلاً لضمان تحميل جميع العناصر
    setTimeout(() => {
        new LoadScreen();
    }, 100);
});

// جعل الفئة متاحة عالمياً
window.LoadScreen = LoadScreen;