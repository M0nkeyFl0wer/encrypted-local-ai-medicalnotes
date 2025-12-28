// Encrypted Medical Notes - Renderer Process
let currentKey = null;

// DOM Elements
const elements = {
    generateKeyBtn: document.getElementById('generateKeyBtn'),
    keyStatus: document.getElementById('keyStatus'),
    patientId: document.getElementById('patientId'),
    noteContent: document.getElementById('noteContent'),
    encryptBtn: document.getElementById('encryptBtn'),
    loadBtn: document.getElementById('loadBtn'),
    statusMessage: document.getElementById('statusMessage'),
    auditLog: document.getElementById('auditLog'),
    navBtns: document.querySelectorAll('.nav-btn'),
    views: document.querySelectorAll('.view')
};

// Initialize application
async function init() {
    try {
        await window.medicalAPI.init();
        showStatus('System initialized - HIPAA compliant encryption ready', 'success');
        updateAuditLog();
    } catch (error) {
        showStatus('Failed to initialize: ' + error.message, 'error');
    }
}

// Navigation
elements.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const viewId = btn.dataset.view + 'View';

        elements.navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        elements.views.forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');

        if (btn.dataset.view === 'audit') {
            updateAuditLog();
        }
    });
});

// Generate Encryption Key
elements.generateKeyBtn.addEventListener('click', async () => {
    try {
        currentKey = await window.medicalAPI.generateKey();
        elements.keyStatus.textContent = 'Active (256-bit)';
        elements.keyStatus.classList.add('active');
        elements.encryptBtn.disabled = false;
        showStatus('Encryption key generated - ready to encrypt notes', 'success');
    } catch (error) {
        showStatus('Key generation failed: ' + error.message, 'error');
    }
});

// Encrypt Note
elements.encryptBtn.addEventListener('click', async () => {
    const patientId = elements.patientId.value.trim();
    const content = elements.noteContent.value.trim();

    if (!patientId || !content) {
        showStatus('Please enter patient ID and note content', 'error');
        return;
    }

    if (!currentKey) {
        showStatus('Please generate an encryption key first', 'error');
        return;
    }

    try {
        elements.encryptBtn.disabled = true;
        elements.encryptBtn.textContent = 'Encrypting...';

        await window.medicalAPI.encrypt(content, patientId, currentKey);

        showStatus(`Note encrypted and saved for patient ${patientId}`, 'success');
        elements.noteContent.value = '';
        updateAuditLog();
    } catch (error) {
        showStatus('Encryption failed: ' + error.message, 'error');
    } finally {
        elements.encryptBtn.disabled = false;
        elements.encryptBtn.textContent = '🔐 Encrypt & Save';
    }
});

// Load Note (placeholder - would open file dialog in full implementation)
elements.loadBtn.addEventListener('click', () => {
    showStatus('Load functionality - select encrypted .json file from data folder', 'success');
});

// Update Audit Log Display
async function updateAuditLog() {
    try {
        const log = await window.medicalAPI.getAuditLog();

        if (log && log.length > 0) {
            elements.auditLog.innerHTML = log.map(entry => `
                <div class="audit-entry">
                    <span class="timestamp">[${entry.timestamp}]</span>
                    <span class="action">${entry.action}</span>
                    - ${entry.details || entry.error || 'N/A'}
                    ${entry.patientId ? `(Patient: ${entry.patientId})` : ''}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load audit log:', error);
    }
}

// Show Status Message
function showStatus(message, type) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = 'status-message ' + type;

    setTimeout(() => {
        elements.statusMessage.className = 'status-message';
    }, 5000);
}

// Initialize on load
init();
