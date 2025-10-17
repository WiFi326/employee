class Violations {
    constructor() {
        this.container = document.getElementById('main-content');
        this.violations = [];
        this.employees = [];
        this.filterByToday = false;
    }

    async load() {
        await this.loadEmployees();
        await this.loadViolations();
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

    async loadViolations() {
        try {
            let query = db.collection('violations').orderBy('date', 'desc');
            
            if (this.filterByToday) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                query = query.where('date', '>=', today)
                            .where('date', '<', tomorrow);
            }
            
            const snapshot = await query.get();
            this.violations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading violations:', error);
            notifications.show('حدث خطأ في تحميل المخالفات', 'error');
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold">إدارة المخالفات</h2>
                <p class="text-base-content/70">إضافة وإدارة مخالفات الموظفين</p>
            </div>

            <div class="card bg-base-200 mb-6">
                <div class="card-body">
                    <h3 class="text-lg font-semibold mb-4">إضافة مخالفة جديدة</h3>
                    <form id="add-violation-form" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">اختر موظف</span>
                            </label>
                            <select id="violation-employee" class="select select-bordered" required>
                                <option value="">اختر موظف</option>
                                ${this.employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">تاريخ المخالفة</span>
                            </label>
                            <input type="date" id="violation-date" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">سبب المخالفة</span>
                            </label>
                            <input type="text" id="violation-reason" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">شدة المخالفة</span>
                            </label>
                            <select id="violation-severity" class="select select-bordered" required>
                                <option value="">اختر الشدة</option>
                                <option value="خفيفة">خفيفة</option>
                                <option value="متوسطة">متوسطة</option>
                                <option value="شديدة">شديدة</option>
                            </select>
                        </div>
                        <div class="md:col-span-2 lg:col-span-4">
                            <button type="submit" class="btn btn-error">
                                إضافة مخالفة
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card bg-base-200">
                <div class="card-body">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <h3 class="text-lg font-semibold">قائمة المخالفات</h3>
                        <div class="flex items-center gap-2">
                            <button id="filter-today-violations" class="btn ${this.filterByToday ? 'btn-error' : 'btn-ghost'}">
                                فلترة حسب اليوم
                            </button>
                            <button id="refresh-violations" class="btn btn-ghost">
                                تحديث
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>اسم الموظف</th>
                                    <th>تاريخ المخالفة</th>
                                    <th>سبب المخالفة</th>
                                    <th>شدة المخالفة</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="violations-list">
                                <!-- سيتم ملء القائمة هنا -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.renderViolationsList();
        this.bindEvents();
    }

    renderViolationsList() {
        const listContainer = document.getElementById('violations-list');
        listContainer.innerHTML = '';

        if (this.violations.length === 0) {
            listContainer.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-8 text-base-content/70">
                        لا توجد مخالفات مسجلة
                    </td>
                </tr>
            `;
            return;
        }

        this.violations.forEach(violation => {
            const employee = this.employees.find(emp => emp.id === violation.employeeId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-medium">${employee?.name || 'غير معروف'}</td>
                <td>${violation.date ? new Date(violation.date.toDate()).toLocaleDateString('ar-EG') : 'غير محدد'}</td>
                <td>${violation.reason}</td>
                <td>
                    <span class="badge ${
                        violation.severity === 'شديدة' ? 'badge-error' :
                        violation.severity === 'متوسطة' ? 'badge-warning' :
                        'badge-success'
                    }">
                        ${violation.severity}
                    </span>
                </td>
                <td>
                    <button class="btn btn-ghost btn-xs edit-violation" data-id="${violation.id}">تعديل</button>
                    <button class="btn btn-ghost btn-xs text-error delete-violation" data-id="${violation.id}">حذف</button>
                </td>
            `;
            listContainer.appendChild(row);
        });
    }

    bindEvents() {
        // إضافة مخالفة جديدة
        document.getElementById('add-violation-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addViolation();
        });

        // فلترة حسب اليوم
        document.getElementById('filter-today-violations').addEventListener('click', async () => {
            this.filterByToday = !this.filterByToday;
            await this.loadViolations();
            this.renderViolationsList();
            // تحديث زر الفلترة
            const filterButton = document.getElementById('filter-today-violations');
            filterButton.className = `btn ${this.filterByToday ? 'btn-error' : 'btn-ghost'}`;
        });

        // تحديث القائمة
        document.getElementById('refresh-violations').addEventListener('click', async () => {
            await this.loadViolations();
            this.renderViolationsList();
            notifications.show('تم تحديث قائمة المخالفات', 'success');
        });

        // أحداث التعديل والحذف للمخالفات
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-violation')) {
                const violationId = e.target.getAttribute('data-id');
                this.editViolation(violationId);
            }
            
            if (e.target.classList.contains('delete-violation')) {
                const violationId = e.target.getAttribute('data-id');
                this.deleteViolation(violationId);
            }
        });
    }

    async addViolation() {
        const employeeId = document.getElementById('violation-employee').value;
        const date = document.getElementById('violation-date').value;
        const reason = document.getElementById('violation-reason').value;
        const severity = document.getElementById('violation-severity').value;

        if (!employeeId || !date || !reason || !severity) {
            notifications.show('يرجى ملء جميع الحقول', 'error');
            return;
        }

        try {
            await db.collection('violations').add({
                employeeId,
                date: new Date(date),
                reason,
                severity,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            notifications.show('تم إضافة المخالفة بنجاح', 'success');
            document.getElementById('add-violation-form').reset();
            await this.loadViolations();
            this.renderViolationsList();
        } catch (error) {
            console.error('Error adding violation:', error);
            notifications.show('حدث خطأ في إضافة المخالفة', 'error');
        }
    }

    async editViolation(violationId) {
        const violation = this.violations.find(v => v.id === violationId);
        if (!violation) return;

        const newReason = prompt('أدخل سبب المخالفة الجديد:', violation.reason);
        const newSeverity = prompt('أدخل شدة المخالفة الجديدة (خفيفة/متوسطة/شديدة):', violation.severity);
        
        if (newReason && newSeverity) {
            try {
                await db.collection('violations').doc(violationId).update({
                    reason: newReason,
                    severity: newSeverity
                });

                notifications.show('تم تعديل المخالفة بنجاح', 'success');
                await this.loadViolations();
                this.renderViolationsList();
            } catch (error) {
                console.error('Error updating violation:', error);
                notifications.show('حدث خطأ في تعديل المخالفة', 'error');
            }
        }
    }

    async deleteViolation(violationId) {
        modal.confirmDelete('المخالفة', async () => {
            try {
                await db.collection('violations').doc(violationId).delete();
                notifications.show('تم حذف المخالفة بنجاح', 'success');
                await this.loadViolations();
                this.renderViolationsList();
            } catch (error) {
                console.error('Error deleting violation:', error);
                notifications.show('حدث خطأ في حذف المخالفة', 'error');
            }
        });
    }
}