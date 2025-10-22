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
             <div class="p-4 overflow-hidden">
    <h2 class="text-xl text-title mb-6 text-center">إدارة الموظفين</h2>

    <ul class=" min-h-[500px] flex flex-col justify-between rounded-xl">
       
    <li class="mb-2">
    <a href="#" data-section="dashboard"
       class="sidebar-link flex items-center gap-2 p-2 rounded-lg border border-black/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_8px_-2px_rgba(0,0,0,0.5)] transition-all">
       
       <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l9-9 9 9M4 10v10h16V10" />
        </svg>
        <span>الصفحة الرئيسية</span>
    </a>
     </li>
        <li>
            <a href="#" data-section="vacations" 
            class="sidebar-link flex items-center gap-2 p-2 rounded-lg border border-black/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_8px_-2px_rgba(0,0,0,0.5)] transition-all">
               
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
                </svg>
                <span>الإجازات</span>
            </a>
        </li>
        <li>
            <a href="#" data-section="rewards" 
            class="sidebar-link flex items-center gap-2 p-2 rounded-lg border border-black/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_8px_-2px_rgba(0,0,0,0.5)] transition-all">
               
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.034 6.26a1 1 0 00.95.69h6.574c.969 0 1.371 1.24.588 1.81l-5.32 3.868a1 1 0 00-.364 1.118l2.034 6.26c.3.921-.755 1.688-1.54 1.118l-5.32-3.868a1 1 0 00-1.176 0l-5.32 3.868c-.784.57-1.838-.197-1.539-1.118l2.034-6.26a1 1 0 00-.364-1.118L2.873 11.687c-.783-.57-.38-1.81.588-1.81h6.574a1 1 0 00.95-.69l2.034-6.26z" />
                </svg>
                <span>المكافآت</span>
            </a>
        </li>
        <li>
            <a href="#" data-section="violations" 
            class="sidebar-link flex items-center gap-2 p-2 rounded-lg border border-black/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_8px_-2px_rgba(0,0,0,0.5)] transition-all">
                
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                </svg>
                <span>المخالفات</span>
            </a>
        </li>
        <li>
            <a href="#" data-section="statistics" 
            class="sidebar-link flex items-center gap-2 p-2 rounded-lg border border-black/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_8px_-2px_rgba(0,0,0,0.5)] transition-all">
                
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18M9 17v-6m4 6V7m4 10v-4" />
                </svg>
                <span>الإحصائيات</span>
            </a>
        </li>
        <li>
            <a href="#" data-section="timings" 
            class="sidebar-link flex items-center gap-2 p-2 rounded-lg border border-black/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_8px_-2px_rgba(0,0,0,0.5)] transition-all">
                
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                </svg>
                <span>الزمنيات</span>
            </a>
        </li>
        <li>
            <a href="#" data-section="employees" 
            class="sidebar-link flex items-center gap-2 p-2 rounded-lg border border-black/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_8px_-2px_rgba(0,0,0,0.5)] transition-all">
                
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l.94 2.922a1 1 0 00.95.69h3.084c.969 0 1.371 1.24.588 1.81l-2.5 1.818a1 1 0 00-.364 1.118l.94 2.922c.3.921-.755 1.688-1.54 1.118l-2.5-1.818a1 1 0 00-1.176 0l-2.5 1.818c-.784.57-1.838-.197-1.539-1.118l.94-2.922a1 1 0 00-.364-1.118L4.387 8.357c-.783-.57-.38-1.81.588-1.81h3.084a1 1 0 00.95-.69l.94-2.922z" />
                </svg>
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
    // 🔹 تصغير الشريط وإخفاء النصوص
    this.sidebar.classList.remove('w-64');
    this.sidebar.classList.add('w-16', 'overflow-hidden');

    this.sidebar.querySelectorAll('.sidebar-link').forEach(link => {
      const span = link.querySelector('span');
      if (span) span.classList.add('hidden');
      link.classList.add('justify-center');

      // 🔹 تكبير الأيقونات عند الإخفاء
      const svg = link.querySelector('svg');
      if (svg) {
        svg.classList.remove('w-5', 'h-5');
        svg.classList.add('w-7', 'h-7'); // ✅ الحجم الأكبر
      }
    });
  } else {
    // 🔹 إعادة الشريط إلى الوضع الطبيعي
    this.sidebar.classList.remove('w-16', 'overflow-hidden');
    this.sidebar.classList.add('w-64');

    this.sidebar.querySelectorAll('.sidebar-link').forEach(link => {
      const span = link.querySelector('span');
      if (span) span.classList.remove('hidden');
      link.classList.remove('justify-center');

      // 🔹 رجع الأيقونات للحجم الطبيعي
      const svg = link.querySelector('svg');
      if (svg) {
        svg.classList.remove('w-7', 'h-7');
        svg.classList.add('w-5', 'h-5');
      }
    });
  }
}

   navigateTo(section) {
    // إزالة الحالة النشطة من جميع الروابط (خلفية + نص + أيقونة)
    const links = this.sidebar.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        link.classList.remove('bg-blue-700');        // إزالة الخلفية النشطة
        link.classList.remove('text-white');         // إزالة كلاس النص الأبيض لو موجود
        // إذا هناك كلاس يضبط النص إلى أسود (مثلاً text-black أو text-title) نزيله أيضاً
        link.classList.remove('text-black', 'text-title');

        // تأكد أن الـ <span> اللي يحتوي النص رجع للوضع الطبيعي
        const span = link.querySelector('span');
        if (span) {
            span.classList.remove('text-white');
            span.classList.remove('text-black', 'text-title');
        }

        // الأيقونة: نعيد stroke أو لونها الأساسي (نستخدم الأبيض كافتراضي هنا إذا تريد غيره غيّره)
        const svg = link.querySelector('svg');
        if (svg) {
            // أزل أية قيمة stroke ثابتة قد حُدِدت سابقًا
            svg.setAttribute('stroke', 'currentColor'); // يجعلها ترث لون النص
        }
    });

    // اجلب الرابط المختار وضَع له الحالة النشطة
    const currentLink = this.sidebar.querySelector(`[data-section="${section}"]`);
    if (!currentLink) return;

    currentLink.classList.add('bg-blue-700');   // الخلفية النشطة

    // اضبط النص والأيقونة ليصيرا أبيض عند التفعيل
    currentLink.classList.add('text-white');
    const currentSpan = currentLink.querySelector('span');
    if (currentSpan) {
        currentSpan.classList.add('text-white');
    }
    const currentSvg = currentLink.querySelector('svg');
    if (currentSvg) {
        currentSvg.setAttribute('stroke', 'white'); // تأكد أن الأيقونة تظهر باللون الأبيض
        // لو تستخدم خصائص fill بدلاً من stroke لبعض الأيقونات:
        currentSvg.setAttribute('fill', 'none'); // أو 'white' إذا تريد مملوءة
    }

    // تحميل القسم المطلوب
    window.loadSection(section);
}

}

// تهيئة الشريط الجانبي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new Sidebar();
});