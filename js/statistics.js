class Statistics {
    constructor() {
        this.container = document.getElementById('main-content');
        this.statistics = [];
        this.employees = [];
        this.searchTerm = '';
    }

    async load() {
        await this.loadEmployees();
        await this.loadStatistics();
        this.render();
    }

    async loadEmployees() {
        try {
            const snapshot = await db.collection('employees').get();
            this.employees = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }

    async loadStatistics() {
        try {
            // جلب جميع البيانات من المجموعات المختلفة
            const [vacationsSnapshot, rewardsSnapshot, violationsSnapshot] = await Promise.all([
                db.collection('vacations').orderBy('startDate', 'desc').get(),
                db.collection('rewards').orderBy('date', 'desc').get(),
                db.collection('violations').orderBy('date', 'desc').get()
            ]);

            this.statistics = [];

            // إضافة الإجازات
            vacationsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                this.statistics.push({
                    id: doc.id,
                    type: 'إجازة',
                    employeeId: data.employeeId,
                    date: data.startDate,
                    details: `نوع الإجازة: ${data.type}`,
                    createdAt: data.createdAt
                });
            });

            // إضافة المكافآت
            rewardsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                this.statistics.push({
                    id: doc.id,
                    type: 'مكافأة',
                    employeeId: data.employeeId,
                    date: data.date,
                    details: `السبب: ${data.reason}`,
                    createdAt: data.createdAt
                });
            });

            // إضافة المخالفات
            violationsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                this.statistics.push({
                    id: doc.id,
                    type: 'مخالفة',
                    employeeId: data.employeeId,
                    date: data.date,
                    details: `السبب: ${data.reason} - الشدة: ${data.severity}`,
                    createdAt: data.createdAt
                });
            });

            // ترتيب البيانات حسب النوع ثم التاريخ
            this.statistics.sort((a, b) => {
                // ترتيب حسب النوع: إجازات أولاً، ثم مكافآت، ثم مخالفات
                const typeOrder = { 'إجازة': 1, 'مكافأة': 2, 'مخالفة': 3 };
                if (typeOrder[a.type] !== typeOrder[b.type]) {
                    return typeOrder[a.type] - typeOrder[b.type];
                }
                // ترتيب حسب التاريخ (من الأحدث إلى الأقدم)
                return b.date.toDate() - a.date.toDate();
            });

        } catch (error) {
            console.error('Error loading statistics:', error);
            notifications.show('حدث خطأ في تحميل الإحصائيات', 'error');
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold">الإحصائيات</h2>
                <p class="text-base-content/70">عرض جميع الإحصائيات والبيانات المجمعة</p>
            </div>

            <div class="card car-col mb-6">
                <div class="card-body">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex-1">
                            <div class="form-control">
                                <div class="join">
                                    <input type="text" id="search-statistics" placeholder="ابحث عن موظف..." 
                                        class="input input-bordered join-item w-full">
                                    <button class="btn btn-primary join-item">
                                        🔍
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button id="refresh-statistics" class="btn btn-primary">
                                تحديث
                            </button>
                            <button id="export-statistics" class="btn btn-success">
                                تصدير إلى Excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card car-col">
                <div class="card-body">
                    <h3 class="text-lg font-semibold mb-4">البيانات المجمعة</h3>
                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>اسم الموظف</th>
                                    <th>النوع</th>
                                    <th>التاريخ</th>
                                    <th>التفاصيل</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="statistics-list">
                                <!-- سيتم ملء القائمة هنا -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.renderStatisticsList();
        this.bindEvents();
    }

    renderStatisticsList() {
        const listContainer = document.getElementById('statistics-list');
        listContainer.innerHTML = '';

        let filteredStatistics = this.statistics;

        // تطبيق البحث إذا كان موجوداً
        if (this.searchTerm) {
            filteredStatistics = this.statistics.filter(stat => {
                const employee = this.employees.find(emp => emp.id === stat.employeeId);
                return employee?.name?.includes(this.searchTerm);
            });
        }

        if (filteredStatistics.length === 0) {
            listContainer.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-8 text-base-content/70">
                        لا توجد بيانات لعرضها
                    </td>
                </tr>
            `;
            return;
        }

        filteredStatistics.forEach(stat => {
            const employee = this.employees.find(emp => emp.id === stat.employeeId);
            const row = document.createElement('tr');
            
            // تحديد لون الصف حسب النوع
            const rowClass = stat.type === 'إجازة' ? 'hover:bg-base-300' : 
                           stat.type === 'مكافأة' ? 'hover:bg-success/10' : 
                           'hover:bg-error/10';

            row.className = rowClass;
            row.innerHTML = `
                <td class="font-medium">${employee?.name || 'غير معروف'}</td>
                <td>
                    <span class="badge ${
                        stat.type === 'إجازة' ? 'badge-info' :
                        stat.type === 'مكافأة' ? 'badge-success' :
                        'badge-error'
                    }">
                        ${stat.type}
                    </span>
                </td>
                <td>${stat.date ? new Date(stat.date.toDate()).toLocaleDateString('ar-EG') : 'غير محدد'}</td>
                <td>${stat.details}</td>
                <td>
                    <button class="btn btn-ghost btn-xs edit-statistic" 
                            data-id="${stat.id}" data-type="${stat.type}">
                        تعديل
                    </button>
                    <button class="btn btn-ghost btn-xs text-error delete-statistic" 
                            data-id="${stat.id}" data-type="${stat.type}">
                        حذف
                    </button>
                </td>
            `;
            listContainer.appendChild(row);
        });
    }

    bindEvents() {
        // البحث
        const searchInput = document.getElementById('search-statistics');
        const searchButton = searchInput.nextElementSibling;
        
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderStatisticsList();
        });

        searchButton.addEventListener('click', () => {
            this.renderStatisticsList();
        });

        // تحديث القائمة
        document.getElementById('refresh-statistics').addEventListener('click', async () => {
            await this.loadStatistics();
            this.renderStatisticsList();
            notifications.show('تم تحديث الإحصائيات', 'success');
        });

        // تصدير إلى Excel
        document.getElementById('export-statistics').addEventListener('click', () => {
            this.exportToExcel();
        });

        // أحداث التعديل والحذف للإحصائيات
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-statistic')) {
                const id = e.target.getAttribute('data-id');
                const type = e.target.getAttribute('data-type');
                this.editStatistic(id, type);
            }
            
            if (e.target.classList.contains('delete-statistic')) {
                const id = e.target.getAttribute('data-id');
                const type = e.target.getAttribute('data-type');
                this.deleteStatistic(id, type);
            }
        });
    }

    editStatistic(id, type) {
        // إعادة توجيه إلى القسم المناسب للتعديل
        switch(type) {
            case 'إجازة':
                window.loadSection('vacations');
                break;
            case 'مكافأة':
                window.loadSection('rewards');
                break;
            case 'مخالفة':
                window.loadSection('violations');
                break;
        }
    }

    async deleteStatistic(id, type) {
        modal.confirmDelete('البيانات', async () => {
            try {
                let collectionName = '';
                switch(type) {
                    case 'إجازة':
                        collectionName = 'vacations';
                        break;
                    case 'مكافأة':
                        collectionName = 'rewards';
                        break;
                    case 'مخالفة':
                        collectionName = 'violations';
                        break;
                }

                if (collectionName) {
                    await db.collection(collectionName).doc(id).delete();
                    notifications.show('تم حذف البيانات بنجاح', 'success');
                    await this.loadStatistics();
                    this.renderStatisticsList();
                }
            } catch (error) {
                console.error('Error deleting statistic:', error);
                notifications.show('حدث خطأ في حذف البيانات', 'error');
            }
        });
    }

    exportToExcel() {
        // تجميع البيانات للتصدير
        const exportData = [];
        const employeesMap = {};
        
        this.employees.forEach(emp => {
            employeesMap[emp.id] = emp.name;
        });

        this.statistics.forEach(stat => {
            const employeeName = employeesMap[stat.employeeId] || 'غير معروف';
            
            if (!exportData[employeeName]) {
                exportData[employeeName] = [];
            }

            exportData[employeeName].push({
                الحالة: stat.type,
                التاريخ: new Date(stat.date?.toDate()).toLocaleDateString('ar-EG'),
                التفاصيل: stat.details,
                التقييم: this.getRating(stat),
                الملاحظات: ''
            });
        });

        // ترتيب الموظفين أبجدياً
        const sortedEmployees = Object.keys(exportData).sort();

        // إنشاء محتوى CSV
        let csvContent = 'الموظف,الحالة,التاريخ,التفاصيل,التقييم,الملاحظات\n';
        
        sortedEmployees.forEach(employee => {
            exportData[employee].forEach(record => {
                csvContent += `${employee},${record.الحالة},${record.التاريخ},${record.التفاصيل},${record.التقييم},${record.الملاحظات}\n`;
            });
        });

        // إنشاء ملف وتنزيله
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `إحصائيات_الموظفين_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notifications.show('تم تصدير البيانات بنجاح', 'success');
    }

    getRating(stat) {
        // تقييم بناءً على نوع البيانات
        switch(stat.type) {
            case 'مكافأة':
                return 'ممتاز';
            case 'إجازة':
                return 'جيد';
            case 'مخالفة':
                return stat.details.includes('شديدة') ? 'ضعيف' : 'متوسط';
            default:
                return 'جيد';
        }
    }
}