class Notifications {
    constructor() {
        this.container = document.getElementById('notifications');
    }

    show(message, type = 'info') {
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-error',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type];

        const notification = document.createElement('div');
        notification.className = `alert ${alertClass} shadow-lg mb-2 transform transition-all duration-300`;
        
        notification.innerHTML = `
            <div class="flex justify-between items-center">
                <span>${message}</span>
                <button class="btn btn-ghost btn-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        // إضافة الإشعار
        this.container.appendChild(notification);
        
        // إضافة حدث الإغلاق
        notification.querySelector('button').addEventListener('click', () => {
            this.hide(notification);
        });
        
        // إخفاء تلقائي بعد 5 ثواني
        setTimeout(() => {
            this.hide(notification);
        }, 5000);
    }

    hide(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

const notifications = new Notifications();