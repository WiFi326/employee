class Rewards {
    constructor() {
        this.container = document.getElementById('main-content');
        this.rewards = [];
        this.employees = [];
        this.filterByToday = false;
    }

    async load() {
        await this.loadEmployees();
        await this.loadRewards();
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

    async loadRewards() {
        try {
            let query = db.collection('rewards').orderBy('date', 'desc');
            
            if (this.filterByToday) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                query = query.where('date', '>=', today)
                            .where('date', '<', tomorrow);
            }
            
            const snapshot = await query.get();
            this.rewards = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading rewards:', error);
            notifications.show('حدث خطأ في تحميل المكافآت', 'error');
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl text-title">إدارة المكافآت</h2>
                <p class="text- text-white">إضافة وإدارة مكافآت الموظفين</p>
            </div>

            <div class="card car-col mb-6">
                <div class="card-body">
                    <h3 class="text-lg text-title mb-4">إضافة مكافأة جديدة</h3>
                    <form id="add-reward-form" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">اختر موظف</span>
                            </label>
                            <select id="reward-employee" class="select select-bordered" required>
                                <option value="">اختر موظف</option>
                                ${this.employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">تاريخ المكافأة</span>
                            </label>
                            <input type="date" id="reward-date" class="input input-bordered" required>
                        </div>
                        <div class="form-control md:col-span-2 lg:col-span-1">
                            <label class="label">
                                <span class="label-text">سبب المكافأة</span>
                            </label>
                            <input type="text" id="reward-reason" class="input input-bordered" required>
                        </div>
                        <div class="md:col-span-2 lg:col-span-3">
                            <button type="submit" class="btn btn-success">
                                إضافة مكافأة
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card car-col">
                <div class="card-body">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <h3 class="text-lg text-title">قائمة المكافآت</h3>
                        <div class="flex items-center gap-2">
                            <button id="filter-today-rewards" class="btn ${this.filterByToday ? 'btn-success' : 'btn-success'}">
                                فلترة حسب اليوم
                            </button>
                            <button id="refresh-rewards" class="btn btn-success">
                                تحديث
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>اسم الموظف</th>
                                    <th>تاريخ المكافأة</th>
                                    <th>سبب المكافأة</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="rewards-list">
                                <!-- سيتم ملء القائمة هنا -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.renderRewardsList();
        this.bindEvents();
    }

    renderRewardsList() {
        const listContainer = document.getElementById('rewards-list');
        listContainer.innerHTML = '';

        if (this.rewards.length === 0) {
            listContainer.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-8 text-base-content/70">
                        لا توجد مكافآت مسجلة
                    </td>
                </tr>
            `;
            return;
        }

        this.rewards.forEach(reward => {
            const employee = this.employees.find(emp => emp.id === reward.employeeId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-medium">${employee?.name || 'غير معروف'}</td>
                <td>${reward.date ? new Date(reward.date.toDate()).toLocaleDateString('ar-EG') : 'غير محدد'}</td>
                <td>${reward.reason}</td>
                <td>
                    <button class="btn btn-ghost btn-xs edit-reward" data-id="${reward.id}">تعديل</button>
                    <button class="btn btn-ghost btn-xs text-error delete-reward" data-id="${reward.id}">حذف</button>
                </td>
            `;
            listContainer.appendChild(row);
        });
    }

    bindEvents() {
        // إضافة مكافأة جديدة
        document.getElementById('add-reward-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addReward();
        });

        // فلترة حسب اليوم
        document.getElementById('filter-today-rewards').addEventListener('click', async () => {
            this.filterByToday = !this.filterByToday;
            await this.loadRewards();
            this.renderRewardsList();
            // تحديث زر الفلترة
            const filterButton = document.getElementById('filter-today-rewards');
            filterButton.className = `btn ${this.filterByToday ? 'btn-success' : 'btn-success'}`;
        });

        // تحديث القائمة
        document.getElementById('refresh-rewards').addEventListener('click', async () => {
            await this.loadRewards();
            this.renderRewardsList();
            notifications.show('تم تحديث قائمة المكافآت', 'success');
        });

        // أحداث التعديل والحذف للمكافآت
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-reward')) {
                const rewardId = e.target.getAttribute('data-id');
                this.editReward(rewardId);
            }
            
            if (e.target.classList.contains('delete-reward')) {
                const rewardId = e.target.getAttribute('data-id');
                this.deleteReward(rewardId);
            }
        });
    }

    async addReward() {
        const employeeId = document.getElementById('reward-employee').value;
        const date = document.getElementById('reward-date').value;
        const reason = document.getElementById('reward-reason').value;

        if (!employeeId || !date || !reason) {
            notifications.show('يرجى ملء جميع الحقول', 'error');
            return;
        }

        try {
            await db.collection('rewards').add({
                employeeId,
                date: new Date(date),
                reason,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            notifications.show('تم إضافة المكافأة بنجاح', 'success');
            document.getElementById('add-reward-form').reset();
            await this.loadRewards();
            this.renderRewardsList();
        } catch (error) {
            console.error('Error adding reward:', error);
            notifications.show('حدث خطأ في إضافة المكافأة', 'error');
        }
    }

    async editReward(rewardId) {
        const reward = this.rewards.find(r => r.id === rewardId);
        if (!reward) return;

        const newReason = prompt('أدخل سبب المكافأة الجديد:', reward.reason);
        
        if (newReason) {
            try {
                await db.collection('rewards').doc(rewardId).update({
                    reason: newReason
                });

                notifications.show('تم تعديل المكافأة بنجاح', 'success');
                await this.loadRewards();
                this.renderRewardsList();
            } catch (error) {
                console.error('Error updating reward:', error);
                notifications.show('حدث خطأ في تعديل المكافأة', 'error');
            }
        }
    }

    async deleteReward(rewardId) {
        modal.confirmDelete('المكافأة', async () => {
            try {
                await db.collection('rewards').doc(rewardId).delete();
                notifications.show('تم حذف المكافأة بنجاح', 'success');
                await this.loadRewards();
                this.renderRewardsList();
            } catch (error) {
                console.error('Error deleting reward:', error);
                notifications.show('حدث خطأ في حذف المكافأة', 'error');
            }
        });
    }
}