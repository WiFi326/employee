class Dashboard {
    constructor() {
        this.container = document.getElementById('main-content');
    }

    async load() {
        this.render();
        await this.loadStats();
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold">الصفحة الرئيسية</h2>
                <p class="text-base-content/70">مرحباً بك في نظام إدارة الموظفين</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="card bg-base-200">
                    <div class="card-body">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-blue-500/20 text-blue-400">
                                <span class="text-xl">🏖️</span>
                            </div>
                            <div class="mr-4">
                                <h3 class="text-sm font-medium text-base-content/70">الإجازات هذا الشهر</h3>
                                <p id="vacations-count" class="text-2xl font-semibold">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-200">
                    <div class="card-body">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-green-500/20 text-green-400">
                                <span class="text-xl">🏆</span>
                            </div>
                            <div class="mr-4">
                                <h3 class="text-sm font-medium text-base-content/70">المكافآت هذا الشهر</h3>
                                <p id="rewards-count" class="text-2xl font-semibold">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-200">
                    <div class="card-body">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-red-500/20 text-red-400">
                                <span class="text-xl">⚠️</span>
                            </div>
                            <div class="mr-4">
                                <h3 class="text-sm font-medium text-base-content/70">المخالفات هذا الشهر</h3>
                                <p id="violations-count" class="text-2xl font-semibold">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-200">
                    <div class="card-body">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-purple-500/20 text-purple-400">
                                <span class="text-xl">⏱️</span>
                            </div>
                            <div class="mr-4">
                                <h3 class="text-sm font-medium text-base-content/70">الزمنيات هذا الشهر</h3>
                                <p id="timings-count" class="text-2xl font-semibold">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-base-200">
                <div class="card-body">
                    <h3 class="text-lg font-semibold mb-4">نظرة عامة</h3>
                    <p class="text-base-content/70">
                        نظام إدارة الموظفين يتيح لك إدارة جميع جوانب عمل الموظفين بسهولة وكفاءة.
                        يمكنك متابعة الإجازات والمكافآت والمخالفات والزمنيات من خلال الأقسام المختلفة.
                    </p>
                </div>
            </div>
        `;
    }

    async loadStats() {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            // جلب عدد الإجازات
            const vacationsSnapshot = await db.collection('vacations')
                .where('startDate', '>=', startOfMonth)
                .where('startDate', '<=', endOfMonth)
                .get();
            document.getElementById('vacations-count').textContent = vacationsSnapshot.size;

            // جلب عدد المكافآت
            const rewardsSnapshot = await db.collection('rewards')
                .where('date', '>=', startOfMonth)
                .where('date', '<=', endOfMonth)
                .get();
            document.getElementById('rewards-count').textContent = rewardsSnapshot.size;

            // جلب عدد المخالفات
            const violationsSnapshot = await db.collection('violations')
                .where('date', '>=', startOfMonth)
                .where('date', '<=', endOfMonth)
                .get();
            document.getElementById('violations-count').textContent = violationsSnapshot.size;

            // جلب عدد الزمنيات
            const timingsSnapshot = await db.collection('timings')
                .where('date', '>=', startOfMonth)
                .where('date', '<=', endOfMonth)
                .get();
            document.getElementById('timings-count').textContent = timingsSnapshot.size;

        } catch (error) {
            console.error('Error loading stats:', error);
            notifications.show('حدث خطأ في تحميل الإحصائيات', 'error');
        }
    }
}