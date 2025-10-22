

// الكائن الرئيسي للتطبيق
const App = {
    currentSection: null,
    sections: {},

    init() {
        this.registerSections();
        this.loadSection('dashboard');
        
        // الاستماع للتغييرات في قاعدة البيانات للتحديث التلقائي
        this.setupRealtimeListeners();
    },

    registerSections() {
        this.sections = {
            dashboard: new Dashboard(),
            employees: new Employees(),
            vacations: new Vacations(),
            rewards: new Rewards(),
            violations: new Violations(),
            statistics: new Statistics(),
            timings: new Timings()
        };
    },

    async loadSection(sectionName) {
        if (this.currentSection === sectionName) return;
        
        this.currentSection = sectionName;
        
        if (this.sections[sectionName]) {
            await this.sections[sectionName].load();
        } else {
            console.error(`Section ${sectionName} not found`);
        }
    },

    setupRealtimeListeners() {
        // الاستماع للتغييرات في الموظفين
        db.collection('employees').onSnapshot(() => {
            if (this.currentSection === 'employees' && this.sections.employees) {
                this.sections.employees.loadEmployees().then(() => {
                    this.sections.employees.renderEmployeesList();
                });
            }
            
            if (this.currentSection === 'statistics' && this.sections.statistics) {
                this.sections.statistics.loadStatistics();
            }
        });

        // الاستماع للتغييرات في الإجازات
        db.collection('vacations').onSnapshot(() => {
            if (this.currentSection === 'vacations' && this.sections.vacations) {
                this.sections.vacations.loadVacations().then(() => {
                    this.sections.vacations.renderVacationsList();
                });
            }
            
            if (this.currentSection === 'dashboard' && this.sections.dashboard) {
                this.sections.dashboard.loadStats();
            }
            
            if (this.currentSection === 'statistics' && this.sections.statistics) {
                this.sections.statistics.loadStatistics();
            }
        });

        // الاستماع للتغييرات في المكافآت
        db.collection('rewards').onSnapshot(() => {
            if (this.currentSection === 'rewards' && this.sections.rewards) {
                this.sections.rewards.loadRewards().then(() => {
                    this.sections.rewards.renderRewardsList();
                });
            }
            
            if (this.currentSection === 'dashboard' && this.sections.dashboard) {
                this.sections.dashboard.loadStats();
            }
            
            if (this.currentSection === 'statistics' && this.sections.statistics) {
                this.sections.statistics.loadStatistics();
            }
        });

        // الاستماع للتغييرات في المخالفات
        db.collection('violations').onSnapshot(() => {
            if (this.currentSection === 'violations' && this.sections.violations) {
                this.sections.violations.loadViolations().then(() => {
                    this.sections.violations.renderViolationsList();
                });
            }
            
            if (this.currentSection === 'dashboard' && this.sections.dashboard) {
                this.sections.dashboard.loadStats();
            }
            
            if (this.currentSection === 'statistics' && this.sections.statistics) {
                this.sections.statistics.loadStatistics();
            }
        });

        // الاستماع للتغييرات في الزمنيات
        db.collection('timings').onSnapshot(() => {
            if (this.currentSection === 'timings' && this.sections.timings) {
                this.sections.timings.loadTimings().then(() => {
                    this.sections.timings.renderTimingsList();
                });
            }
            
            if (this.currentSection === 'dashboard' && this.sections.dashboard) {
                this.sections.dashboard.loadStats();
            }
        });
    }
};


// جعل الدالة متاحة عالمياً
window.loadSection = (sectionName) => {
    App.loadSection(sectionName);
};

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});


window.logout = logout;