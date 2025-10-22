class Vacations {
    constructor() {
        this.container = document.getElementById('main-content');
        this.vacations = [];
        this.employees = [];
        this.filterByToday = false;
    }

    async load() {
        await this.loadEmployees();
        await this.loadVacations();
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

    async loadVacations() {
        try {
            let query = db.collection('vacations').orderBy('startDate', 'desc');
            
            if (this.filterByToday) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                query = query.where('startDate', '>=', today)
                            .where('startDate', '<', tomorrow);
            }
            
            const snapshot = await query.get();
            this.vacations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading vacations:', error);
            notifications.show('حدث خطأ في تحميل الإجازات', 'error');
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl text-title">إدارة الإجازات</h2>
                <p class="text-white">إضافة وإدارة إجازات الموظفين</p>
            </div>

            <div class="card car-col mb-6">
                <div class="card-body">
                    <h3 class="text-lg text-title mb-4">إضافة إجازة جديدة</h3>
                    <form id="add-vacation-form" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">اختر موظف</span>
                            </label>
                            <select id="vacation-employee" class="select select-bordered" required>
                                <option value="">اختر موظف</option>
                                ${this.employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">تاريخ البدء</span>
                            </label>
                            <input type="date" id="vacation-start" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">تاريخ الانتهاء</span>
                            </label>
                            <input type="date" id="vacation-end" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">نوع الإجازة</span>
                            </label>
                            <select id="vacation-type" class="select select-bordered" required>
                                <option value="">اختر النوع</option>
                                <option value="يومية">يومية</option>
                                <option value="مرضية">مرضية</option>
                                <option value="مفتوحة">مفتوحة</option>
                                <option value="بدون راتب">بدون راتب</option>
                            </select>
                        </div>
                        <div class="md:col-span-2 lg:col-span-4">
                            <button type="submit" class="btn btn-primary">
                                إضافة إجازة
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card car-col">
                <div class="card-body">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <h3 class="text-lg text-title">قائمة الإجازات</h3>
                        <div class="flex items-center gap-2">
                            <button id="filter-today" class="btn ${this.filterByToday ? 'btn-primary' : 'btn-primary'}">
                                فلترة حسب اليوم
                            </button>
                            <button id="refresh-vacations" class="btn btn-primary">
                                تحديث
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="table border border-gray-400 rounded-xl shadow-sm"">
                            <thead>
                                <tr>
                                    <th>اسم الموظف</th>
                                    <th>نوع الإجازة</th>
                                    <th>تاريخ البدء</th>
                                    <th>تاريخ الانتهاء</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="vacations-list">
                                <!-- سيتم ملء القائمة هنا -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.renderVacationsList();
        this.bindEvents();
    }

    renderVacationsList() {
        const listContainer = document.getElementById('vacations-list');
        listContainer.innerHTML = '';

        if (this.vacations.length === 0) {
            listContainer.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-8 text-base-content/70">
                        لا توجد إجازات مسجلة
                    </td>
                </tr>
            `;
            return;
        }

        this.vacations.forEach(vacation => {
            const employee = this.employees.find(emp => emp.id === vacation.employeeId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-medium">${employee?.name || 'غير معروف'}</td>
                <td>${vacation.type}</td>
                <td>${vacation.startDate ? new Date(vacation.startDate.toDate()).toLocaleDateString('en-US') : 'غير محدد'}</td>
                <td>${vacation.endDate ? new Date(vacation.endDate.toDate()).toLocaleDateString('en-US') : 'غير محدد'}</td>
                <td>
                    <button class="btn btn-ghost btn-xs edit-vacation" data-id="${vacation.id}">تعديل</button>
                    <button class="btn btn-ghost btn-xs text-error delete-vacation" data-id="${vacation.id}">حذف</button>
                </td>
            `;
            listContainer.appendChild(row);
        });
    }

    bindEvents() {
        // إضافة إجازة جديدة
        document.getElementById('add-vacation-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addVacation();
        });

        // فلترة حسب اليوم
        document.getElementById('filter-today').addEventListener('click', async () => {
            this.filterByToday = !this.filterByToday;
            await this.loadVacations();
            this.renderVacationsList();
            // تحديث زر الفلترة
            const filterButton = document.getElementById('filter-today');
            filterButton.className = `btn ${this.filterByToday ? 'btn-primary' : 'btn-primary'}`;
        });

        // تحديث القائمة
        document.getElementById('refresh-vacations').addEventListener('click', async () => {
            await this.loadVacations();
            this.renderVacationsList();
            notifications.show('تم تحديث قائمة الإجازات', 'success');
        });

        // أحداث التعديل والحذف للإجازات
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-vacation')) {
                const vacationId = e.target.getAttribute('data-id');
                this.editVacation(vacationId);
            }
            
            if (e.target.classList.contains('delete-vacation')) {
                const vacationId = e.target.getAttribute('data-id');
                this.deleteVacation(vacationId);
            }
        });
    }

    async addVacation() {
        const employeeId = document.getElementById('vacation-employee').value;
        const startDate = document.getElementById('vacation-start').value;
        const endDate = document.getElementById('vacation-end').value;
        const type = document.getElementById('vacation-type').value;

        if (!employeeId || !startDate || !endDate || !type) {
            notifications.show('يرجى ملء جميع الحقول', 'error');
            return;
        }

        try {
            await db.collection('vacations').add({
                employeeId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                type,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            notifications.show('تم إضافة الإجازة بنجاح', 'success');
            document.getElementById('add-vacation-form').reset();
            await this.loadVacations();
            this.renderVacationsList();
        } catch (error) {
            console.error('Error adding vacation:', error);
            notifications.show('حدث خطأ في إضافة الإجازة', 'error');
        }
    }

    async editVacation(vacationId) {
        const vacation = this.vacations.find(v => v.id === vacationId);
        if (!vacation) return;

        const newType = prompt('أدخل نوع الإجازة الجديد:', vacation.type);
        
        if (newType) {
            try {
                await db.collection('vacations').doc(vacationId).update({
                    type: newType
                });

                notifications.show('تم تعديل الإجازة بنجاح', 'success');
                await this.loadVacations();
                this.renderVacationsList();
            } catch (error) {
                console.error('Error updating vacation:', error);
                notifications.show('حدث خطأ في تعديل الإجازة', 'error');
            }
        }
    }

    async deleteVacation(vacationId) {
        modal.confirmDelete('الإجازة', async () => {
            try {
                await db.collection('vacations').doc(vacationId).delete();
                notifications.show('تم حذف الإجازة بنجاح', 'success');
                await this.loadVacations();
                this.renderVacationsList();
            } catch (error) {
                console.error('Error deleting vacation:', error);
                notifications.show('حدث خطأ في حذف الإجازة', 'error');
            }
        });
    }
}