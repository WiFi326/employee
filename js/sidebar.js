class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.toggleButton = document.getElementById('toggleSidebar');
        this.isCollapsed = false;
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.sidebar.innerHTML = `
            <div class="p-4">
                <h2 class="text-xl text-title mb-6">إدارة الموظفين</h2>
                <ul class="menu menu-lg w-full">
                    <li>
                        <a href="#" data-section="dashboard" class="sidebar-link">
                            <span>📊</span>
                            <span>الصفحة الرئيسية</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" data-section="vacations" class="sidebar-link">
                            <span>🏖️</span>
                            <span>الإجازات</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" data-section="rewards" class="sidebar-link">
                            <span>🏆</span>
                            <span>المكافآت</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" data-section="violations" class="sidebar-link">
                            <span>⚠️</span>
                            <span>المخالفات</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" data-section="statistics" class="sidebar-link">
                            <span>📈</span>
                            <span>الإحصائيات</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" data-section="timings" class="sidebar-link">
                            <span>⏱️</span>
                            <span>الزمنيات</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" data-section="employees" class="sidebar-link">
                            <span>⚙️</span>
                            <span>الإعدادات</span>
                        </a>
                    </li>
                </ul>
            </div>
        `;
    }


    bindEvents() {
        // زر إظهار/إخفاء الشريط الجانبي
        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });

        // أحداث الروابط
        const links = this.sidebar.querySelectorAll('.sidebar-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateTo(section);
            });
        });
    }

    toggle() {
        this.isCollapsed = !this.isCollapsed;
        if (this.isCollapsed) {
            this.sidebar.classList.add('w-16');
            this.sidebar.querySelectorAll('span:not(:first-child)').forEach(span => {
                span.classList.add('hidden');
            });
        } else {
            this.sidebar.classList.remove('w-16');
            this.sidebar.querySelectorAll('span:not(:first-child)').forEach(span => {
                span.classList.remove('hidden');
            });
        }
    }

    navigateTo(section) {
        // إزالة النشاط من جميع الروابط
        const links = this.sidebar.querySelectorAll('.sidebar-link');
        links.forEach(link => {
            link.classList.remove('bg-blue-700');
        });

        // إضافة النشاط للرابط الحالي
        const currentLink = this.sidebar.querySelector(`[data-section="${section}"]`);
        currentLink.classList.add('bg-blue-700');

        // تحميل القسم المطلوب
        window.loadSection(section);
    }
}

// تهيئة الشريط الجانبي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new Sidebar();
});