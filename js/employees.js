class Employees {
    constructor() {
        this.container = document.getElementById('main-content');
        this.employees = [];
    }

    async load() {
        await this.loadEmployees();
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
            notifications.show('حدث خطأ في تحميل الموظفين', 'error');
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold">الإعدادات - إدارة الموظفين</h2>
                <p class="text-base-content/70">إضافة وإدارة بيانات الموظفين</p>
            </div>

            <div class="card car-col mb-6">
                <div class="card-body">
                    <h3 class="text-lg font-semibold mb-4">إضافة موظف جديد</h3>
                    <form id="add-employee-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">اسم الموظف</span>
                            </label>
                            <input type="text" id="employee-name" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">نوع العمل</span>
                            </label>
                            <select id="employee-type" class="select select-bordered" required>
                                <option value="">اختر نوع العمل</option>
                                <option value="فني">فني</option>
                                <option value="جوكر">جوكر</option>
                                <option value="متابع">متابع</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <button type="submit" class="btn btn-primary">
                                إضافة موظف
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card car-col mb-6">
                <div class="card-body">
                    <h3 class="text-lg font-semibold mb-4">قائمة الموظفين</h3>
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>الاسم</th>
                                    <th>نوع العمل</th>
                                    <th>تاريخ الإضافة</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="employees-list">
                                <!-- سيتم ملء القائمة هنا -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card car-col">
                <div class="card-body">
                    <h3 class="text-lg font-semibold text-error">خيارات متقدمة</h3>
                    <button id="delete-statistics" class="btn btn-error">
                        حذف بيانات الإحصائيات
                    </button>
                </div>
            </div>
        `;

        this.renderEmployeesList();
        this.bindEvents();
    }

    renderEmployeesList() {
        const listContainer = document.getElementById('employees-list');
        listContainer.innerHTML = '';

        if (this.employees.length === 0) {
            listContainer.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-8 text-base-content/70">
                        لا يوجد موظفين مسجلين
                    </td>
                </tr>
            `;
            return;
        }

        this.employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-medium">${employee.name}</td>
                <td>${employee.type}</td>
                <td>${employee.createdAt ? new Date(employee.createdAt.toDate()).toLocaleDateString('ar-EG') : 'غير محدد'}</td>
                <td>
                    <button class="btn btn-ghost btn-xs edit-employee" data-id="${employee.id}">تعديل</button>
                    <button class="btn btn-ghost btn-xs text-error delete-employee" data-id="${employee.id}">حذف</button>
                </td>
            `;
            listContainer.appendChild(row);
        });
    }

    bindEvents() {
        // إضافة موظف جديد
        document.getElementById('add-employee-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addEmployee();
        });

        // حذف بيانات الإحصائيات
        document.getElementById('delete-statistics').addEventListener('click', () => {
            this.showDeleteStatisticsModal();
        });

        // أحداث التعديل والحذف للموظفين
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-employee')) {
                const employeeId = e.target.getAttribute('data-id');
                this.editEmployee(employeeId);
            }
            
            if (e.target.classList.contains('delete-employee')) {
                const employeeId = e.target.getAttribute('data-id');
                this.deleteEmployee(employeeId);
            }
        });
    }

    async addEmployee() {
        const name = document.getElementById('employee-name').value;
        const type = document.getElementById('employee-type').value;

        if (!name || !type) {
            notifications.show('يرجى ملء جميع الحقول', 'error');
            return;
        }

        try {
            await db.collection('employees').add({
                name,
                type,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            notifications.show('تم إضافة الموظف بنجاح', 'success');
            document.getElementById('add-employee-form').reset();
            await this.loadEmployees();
            this.renderEmployeesList();
        } catch (error) {
            console.error('Error adding employee:', error);
            notifications.show('حدث خطأ في إضافة الموظف', 'error');
        }
    }

    async editEmployee(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (!employee) return;

        const newName = prompt('أدخل الاسم الجديد:', employee.name);
        const newType = prompt('أدخل نوع العمل الجديد:', employee.type);

        if (newName && newType) {
            try {
                await db.collection('employees').doc(employeeId).update({
                    name: newName,
                    type: newType
                });

                notifications.show('تم تعديل بيانات الموظف بنجاح', 'success');
                await this.loadEmployees();
                this.renderEmployeesList();
            } catch (error) {
                console.error('Error updating employee:', error);
                notifications.show('حدث خطأ في تعديل بيانات الموظف', 'error');
            }
        }
    }

    async deleteEmployee(employeeId) {
        modal.confirmDelete('الموظف', async () => {
            try {
                await db.collection('employees').doc(employeeId).delete();
                notifications.show('تم حذف الموظف بنجاح', 'success');
                await this.loadEmployees();
                this.renderEmployeesList();
            } catch (error) {
                console.error('Error deleting employee:', error);
                notifications.show('حدث خطأ في حذف الموظف', 'error');
            }
        });
    }

    showDeleteStatisticsModal() {
        modal.show(
            'حذف بيانات الإحصائيات',
            `
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">أدخل كلمة المرور</span>
                    </label>
                    <input type="password" id="delete-password" class="input input-bordered" placeholder="كلمة المرور">
                </div>
                <p class="text-sm text-error mt-2">تحذير: هذا الإجراء سيحذف جميع بيانات الإحصائيات ولا يمكن التراجع عنه</p>
            `,
            () => {
                const password = document.getElementById('delete-password').value;
                if (password === 'admin123') {
                    this.deleteAllStatistics();
                } else {
                    notifications.show('كلمة المرور غير صحيحة', 'error');
                }
            },
            'حذف',
            'إلغاء'
        );
    }

    async deleteAllStatistics() {
        try {
            // حذف جميع بيانات الإحصائيات
            const batch = db.batch();
            
            // حذف الإجازات
            const vacationsSnapshot = await db.collection('vacations').get();
            vacationsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            // حذف المكافآت
            const rewardsSnapshot = await db.collection('rewards').get();
            rewardsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            // حذف المخالفات
            const violationsSnapshot = await db.collection('violations').get();
            violationsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            notifications.show('تم حذف جميع بيانات الإحصائيات بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting statistics:', error);
            notifications.show('حدث خطأ في حذف بيانات الإحصائيات', 'error');
        }
    }
}