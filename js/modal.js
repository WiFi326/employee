class Modal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.getElementById('modal-body');
        this.modalCancel = document.getElementById('modal-cancel');
        this.modalConfirm = document.getElementById('modal-confirm');
        
        this.init();
    }

    init() {
        // إغلاق المودال عند النقر خارج المحتوى
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // زر الإلغاء
        this.modalCancel.addEventListener('click', () => {
            this.hide();
        });
    }

    show(title, body, onConfirm = null, confirmText = 'تأكيد', cancelText = 'إلغاء') {
        this.modalTitle.textContent = title;
        this.modalBody.innerHTML = body;
        this.modalConfirm.textContent = confirmText;
        this.modalCancel.textContent = cancelText;

        // إزالة الأحداث السابقة
        this.modalConfirm.replaceWith(this.modalConfirm.cloneNode(true));
        this.modalConfirm = document.getElementById('modal-confirm');

        // إضافة الحدث الجديد
        if (onConfirm) {
            this.modalConfirm.addEventListener('click', () => {
                onConfirm();
                this.hide();
            });
        } else {
            this.modalConfirm.addEventListener('click', () => {
                this.hide();
            });
        }

        this.modal.classList.add('modal-open');
    }

    hide() {
        this.modal.classList.remove('modal-open');
    }

    // دوال مساعدة للاستخدام الشائع
    confirmDelete(itemName, onConfirm) {
        this.show(
            'تأكيد الحذف',
            `هل أنت متأكد من حذف ${itemName}؟ هذا الإجراء لا يمكن التراجع عنه.`,
            onConfirm,
            'حذف',
            'إلغاء'
        );
    }

    confirmAction(actionName, message, onConfirm) {
        this.show(
            `تأكيد ${actionName}`,
            message,
            onConfirm,
            'تأكيد',
            'إلغاء'
        );
    }
}

// إنشاء instance من المودال
const modal = new Modal();