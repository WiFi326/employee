class Timings {
    constructor() {
        this.container = document.getElementById('main-content');
        this.timings = [];
        this.employees = [];
        this.searchTerm = '';
    }

    async load() {
        await this.loadEmployees();
        await this.loadTimings();
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

    async loadTimings() {
        try {
            const snapshot = await db.collection('timings').orderBy('date', 'desc').get();
            this.timings = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading timings:', error);
            notifications.show('حدث خطأ في تحميل الزمنيات', 'error');
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl text-title">إدارة الزمنيات</h2>
                <p class="text-white">إضافة وإدارة زمنيات العمل الإضافي</p>
            </div>

            <div class="card car-col mb-6">
                <div class="card-body">
                    <h3 class="text-lg text-title mb-4">إضافة زمنية جديدة</h3>
                    <form id="add-timing-form" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">اختر موظف</span>
                            </label>
                            <select id="timing-employee" class="select select-bordered" required>
                                <option value="">اختر موظف</option>
                                ${this.employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">مدة الزمنية</span>
                            </label>
                            <select id="timing-duration" class="select select-bordered" required>
                                <option value="">اختر المدة</option>
                                <option value="ربع ساعة">ربع ساعة</option>
                                <option value="نص ساعة">نص ساعة</option>
                                <option value="ساعة">ساعة</option>
                                <option value="ساعة ونصف">ساعة ونصف</option>
                                <option value="ساعتين">ساعتين</option>
                                <option value="ساعتين ونصف">ساعتين ونصف</option>
                                <option value="3 ساعات">3 ساعات</option>
                                <option value="4 ساعات">4 ساعات</option>
                                <option value="5 ساعات">5 ساعات</option>
                            </select>
                        </div>
                        <div class="form-control md:col-span-2 lg:col-span-2">
                            <label class="label">
                                <span class="label-text">تاريخ ووقت الإضافة</span>
                            </label>
                            <input type="datetime-local" id="timing-date" class="input input-bordered" required>
                        </div>
                        <div class="md:col-span-2 lg:col-span-4">
                            <button type="submit" class="btn btn-primary">
                                إضافة زمنية
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card car-col">
                <div class="card-body">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <h3 class="text-lg text-title">قائمة الزمنيات</h3>
                        <div class="flex items-center gap-2">
                            <div class="form-control">
                                <div class="join">
                                    <input type="text" id="search-timings" placeholder="ابحث عن موظف..." 
                                        class="input input-bordered join-item w-full">
                                    <button class="btn btn-primary join-item">
                                        🔍
                                    </button>
                                </div>
                            </div>
                            <button id="refresh-timings" class="btn btn-primary">
                                تحديث
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="table border border-gray-400 rounded-xl shadow-sm" ">
                            <thead>
                                <tr>
                                    <th>اسم الموظف</th>
                                    <th>مدة الزمنية</th>
                                    <th>التاريخ والوقت</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="timings-list">
                                <!-- سيتم ملء القائمة هنا -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // تعيين التاريخ الحالي كقيمة افتراضية
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById('timing-date').value = localDateTime;

        this.renderTimingsList();
        this.bindEvents();
    }

    renderTimingsList() {
        const listContainer = document.getElementById('timings-list');
        listContainer.innerHTML = '';

        let filteredTimings = this.timings;

        // تطبيق البحث إذا كان موجوداً
        if (this.searchTerm) {
            filteredTimings = this.timings.filter(timing => {
                const employee = this.employees.find(emp => emp.id === timing.employeeId);
                return employee?.name?.includes(this.searchTerm);
            });
        }

        if (filteredTimings.length === 0) {
            listContainer.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-8 text-base-content/70">
                        لا توجد زمنيات مسجلة
                    </td>
                </tr>
            `;
            return;
        }

        filteredTimings.forEach(timing => {
            const employee = this.employees.find(emp => emp.id === timing.employeeId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-medium">${employee?.name || 'غير معروف'}</td>
                <td>
                    <span class="badge badge-primary">
                        ${timing.duration}
                    </span>
                </td>
                <td>${timing.date ? new Date(timing.date.toDate()).toLocaleString('ar-EG') : 'غير محدد'}</td>
                <td>
                    <button class="btn btn-ghost btn-xs edit-timing" data-id="${timing.id}">تعديل</button>
                    <button class="btn btn-ghost btn-xs text-error delete-timing" data-id="${timing.id}">حذف</button>
                </td>
            `;
            listContainer.appendChild(row);
        });
    }

    bindEvents() {
        // إضافة زمنية جديدة
        document.getElementById('add-timing-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addTiming();
        });

        // البحث
        const searchInput = document.getElementById('search-timings');
        const searchButton = searchInput.nextElementSibling;
        
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderTimingsList();
        });

        searchButton.addEventListener('click', () => {
            this.renderTimingsList();
        });

        // تحديث القائمة
        document.getElementById('refresh-timings').addEventListener('click', async () => {
            await this.loadTimings();
            this.renderTimingsList();
            notifications.show('تم تحديث قائمة الزمنيات', 'success');
        });

        // أحداث التعديل والحذف للزمنيات
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-timing')) {
                const timingId = e.target.getAttribute('data-id');
                this.editTiming(timingId);
            }
            
            if (e.target.classList.contains('delete-timing')) {
                const timingId = e.target.getAttribute('data-id');
                this.deleteTiming(timingId);
            }
        });
    }

    async addTiming() {
        const employeeId = document.getElementById('timing-employee').value;
        const duration = document.getElementById('timing-duration').value;
        const date = document.getElementById('timing-date').value;

        if (!employeeId || !duration || !date) {
            notifications.show('يرجى ملء جميع الحقول', 'error');
            return;
        }

        try {
            await db.collection('timings').add({
                employeeId,
                duration,
                date: new Date(date),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            notifications.show('تم إضافة الزمنية بنجاح', 'success');
            document.getElementById('add-timing-form').reset();
            
            // إعادة تعيين التاريخ الحالي
            const now = new Date();
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            document.getElementById('timing-date').value = localDateTime;
            
            await this.loadTimings();
            this.renderTimingsList();
        } catch (error) {
            console.error('Error adding timing:', error);
            notifications.show('حدث خطأ في إضافة الزمنية', 'error');
        }
    }

    async editTiming(timingId) {
        const timing = this.timings.find(t => t.id === timingId);
        if (!timing) return;

        const newDuration = prompt('أدخل مدة الزمنية الجديدة:', timing.duration);
        
        if (newDuration) {
            try {
                await db.collection('timings').doc(timingId).update({
                    duration: newDuration
                });

                notifications.show('تم تعديل الزمنية بنجاح', 'success');
                await this.loadTimings();
                this.renderTimingsList();
            } catch (error) {
                console.error('Error updating timing:', error);
                notifications.show('حدث خطأ في تعديل الزمنية', 'error');
            }
        }
    }

    async deleteTiming(timingId) {
        modal.confirmDelete('الزمنية', async () => {
            try {
                await db.collection('timings').doc(timingId).delete();
                notifications.show('تم حذف الزمنية بنجاح', 'success');
                await this.loadTimings();
                this.renderTimingsList();
            } catch (error) {
                console.error('Error deleting timing:', error);
                notifications.show('حدث خطأ في حذف الزمنية', 'error');
            }
        });
    }
}