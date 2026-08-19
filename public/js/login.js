function showForm(view) {

    // =========================
    // SWITCH FORMS
    // =========================

    const forms = ['login', 'signup', 'forgot'];

    forms.forEach(formName => {

        const form = document.getElementById(`form-${formName}`);

        if (form) {
            form.classList.toggle(
                'active',
                formName === view
            );
        }

    });


    // =========================
    // SWITCH TABS
    // =========================

    const loginTab = document.getElementById('tab-login');
    const signupTab = document.getElementById('tab-signup');

    loginTab.classList.toggle(
        'active',
        view === 'login'
    );

    signupTab.classList.toggle(
        'active',
        view === 'signup'
    );


    // =========================
    // TAB INDICATOR
    // =========================

    const indicator =
        document.getElementById('tab-indicator');

    if (view === 'login') {

        indicator.style.transform =
            'translateX(0)';

    } else if (view === 'signup') {

        indicator.style.transform =
            'translateX(100%)';

    }


    // =========================
    // SHOW / HIDE TABS
    // =========================

    const tabs =
        document.getElementById('tabs');

    if (view === 'forgot') {

        tabs.style.display = 'none';

    } else {

        tabs.style.display = 'flex';

    }


    // =========================
    // HEADER TEXT
    // =========================

    const title =
        document.getElementById('form-title');

    const description =
        document.getElementById('form-description');


    if (view === 'login') {

        title.textContent = 'Welcome Back';

        description.textContent =
            'Enter your credentials to access your account.';

    }


    else if (view === 'signup') {

        title.textContent =
            'Create Account';

        description.textContent =
            'Join the alumni network by creating a new account.';

    }


    else if (view === 'forgot') {

        title.textContent =
            'Reset Password';

        description.textContent =
            'Recover access to your account.';

        resetForgotForm();

    } else {
        resetForgotForm();
    }

}


// =========================
// FORGOT PASSWORD FLOW
// =========================

function resetForgotForm() {

    const steps = [1, 2, 3, 'success'];

    steps.forEach(s => {
        const el = document.getElementById(`forgot-step-${s}`);
        if (el) el.style.display = s === 1 ? 'block' : 'none';
    });

    const info = document.getElementById('forgot-info');

    if (info) {
        info.style.display = 'block';
        info.textContent = 'Enter your email to receive a verification code.';
    }

    ['forgot-email', 'forgot-code', 'forgot-password', 'forgot-confirm-password'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
        setFieldError(id, '');
    });

}

async function handleForgotStep1() {

    const emailInput = document.getElementById('forgot-email');
    const btn = document.getElementById('forgot-btn-step1');

    if (!emailInput) return;

    const email = emailInput.value.trim();
    setFieldError('forgot-email', '');

    if (!validateField('forgot-email', email, "Email can't be empty.")) {
        return;
    }

    if (!validateField('forgot-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Please enter a valid email address.')) {
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending Code...';
    }

    try {
        const response = await fetch('/forgot-password/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            setFieldError('forgot-email', data.message || 'Failed to send verification code.');
            return;
        }

        document.getElementById('forgot-step-1').style.display = 'none';
        document.getElementById('forgot-step-2').style.display = 'block';

        const info = document.getElementById('forgot-info');

        if (info) {
            info.textContent = `A 6-digit verification code has been sent to ${email}.`;
        }

        const title = document.getElementById('form-title');
        const description = document.getElementById('form-description');

        if (title) title.textContent = 'Verify Code';
        if (description) description.textContent = 'Enter the verification code sent to your email.';

    } catch (err) {
        setFieldError('forgot-email', 'Network error. Please try again.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Send Verification Code';
        }
    }

}

async function handleForgotStep2() {

    const emailInput = document.getElementById('forgot-email');
    const codeInput = document.getElementById('forgot-code');
    const btn = document.getElementById('forgot-btn-step2');

    if (!emailInput || !codeInput) return;

    const email = emailInput.value.trim();
    const code = codeInput.value.trim();
    setFieldError('forgot-code', '');

    if (!validateField('forgot-code', code, "Verification code can't be empty.")) {
        return;
    }

    if (!validateField('forgot-code', /^\d{6}$/.test(code), 'Please enter a valid 6-digit verification code.')) {
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Verifying Code...';
    }

    try {
        const response = await fetch('/forgot-password/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            setFieldError('forgot-code', data.message || 'Invalid or expired verification code.');
            return;
        }

        document.getElementById('forgot-step-2').style.display = 'none';
        document.getElementById('forgot-step-3').style.display = 'block';

        const info = document.getElementById('forgot-info');

        if (info) {
            info.textContent = 'Code verified! Enter your new password below.';
        }

        const title = document.getElementById('form-title');
        const description = document.getElementById('form-description');

        if (title) title.textContent = 'New Password';
        if (description) description.textContent = 'Enter and confirm your new password.';

    } catch (err) {
        setFieldError('forgot-code', 'Network error. Please try again.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Verify Code';
        }
    }

}

async function handleForgotStep3() {

    const emailInput = document.getElementById('forgot-email');
    const codeInput = document.getElementById('forgot-code');
    const passwordInput = document.getElementById('forgot-password');
    const confirmInput = document.getElementById('forgot-confirm-password');
    const btn = document.getElementById('forgot-btn-step3');

    if (!emailInput || !codeInput || !passwordInput || !confirmInput) return;

    const email = emailInput.value.trim();
    const code = codeInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    setFieldError('forgot-password', '');
    setFieldError('forgot-confirm-password', '');

    let hasError = false;

    if (!validateField('forgot-password', password.length >= 8, 'Password must be at least 8 characters.')) {
        hasError = true;
    }

    if (!validateField('forgot-confirm-password', confirmPassword.length > 0, 'Please confirm your new password.')) {
        hasError = true;
    } else if (!validateField('forgot-confirm-password', password === confirmPassword, 'Passwords do not match.')) {
        hasError = true;
    }

    if (hasError) return;

    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Resetting Password...';
    }

    try {
        const response = await fetch('/forgot-password/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code, newPassword: password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            setFieldError('forgot-password', data.message || 'Failed to reset password.');
            return;
        }

        document.getElementById('forgot-step-3').style.display = 'none';
        document.getElementById('forgot-step-success').style.display = 'block';

        const info = document.getElementById('forgot-info');

        if (info) {
            info.style.display = 'none';
        }

        const title = document.getElementById('form-title');
        const description = document.getElementById('form-description');

        if (title) title.textContent = 'Password Reset';
        if (description) description.textContent = 'Your password has been reset successfully.';

    } catch (err) {
        setFieldError('forgot-password', 'Network error. Please try again.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Reset Password';
        }
    }

}


// =========================
// LOGIN VALIDATION
// =========================

function setFieldError(inputId, message) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(`${inputId}-error`);

    if (!input || !error) return;

    if (message) {

        input.classList.add('input-error');
        error.textContent = message;
        error.style.display = 'block';

    } else {

        input.classList.remove('input-error');
        error.textContent = '';
        error.style.display = 'none';

    }

}

function validateField(inputId, condition, message) {

    if (condition) {

        setFieldError(inputId, '');
        return true;

    }

    setFieldError(inputId, message);
    return false;

}

function validateLoginForm() {

    const emailInput = document.getElementById('login-id');
    const passwordInput = document.getElementById('login-password');

    if (!emailInput || !passwordInput) return false;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    setFieldError('login-id', '');
    setFieldError('login-password', '');

    let hasError = false;

    if (!validateField('login-id', email, 'Email can\'t be empty.')) {
        hasError = true;
    } else if (!validateField('login-id', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Please enter a valid email address.')) {
        hasError = true;
    }

    if (!validateField('login-password', password.length > 0, 'Password can\'t be empty.')) {
        hasError = true;
    }

    return !hasError;

}

function validateSignupForm() {

    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const courseInput = document.getElementById('signup-course');
    const yearInput = document.getElementById('signup-graduation-year');
    const alumniIdInput = document.getElementById('signup-alumni-id');
    const passwordInput = document.getElementById('signup-password');

    if (!nameInput || !emailInput || !courseInput || !yearInput || !alumniIdInput || !passwordInput) return false;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const course = courseInput.value;
    const year = yearInput.value.trim();
    const alumniId = alumniIdInput.value.trim();
    const password = passwordInput.value;

    setFieldError('signup-name', '');
    setFieldError('signup-email', '');
    setFieldError('signup-course', '');
    setFieldError('signup-graduation-year', '');
    setFieldError('signup-alumni-id', '');
    setFieldError('signup-password', '');

    let hasError = false;

    if (!validateField('signup-name', name, 'Name can\'t be empty.')) {
        hasError = true;
    }

    if (!validateField('signup-email', email, 'Email can\'t be empty.')) {
        hasError = true;
    } else if (!validateField('signup-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Please enter a valid email address.')) {
        hasError = true;
    }

    if (!validateField('signup-course', course, 'Please select a course.')) {
        hasError = true;
    }

    if (!validateField('signup-graduation-year', year, 'Graduation year can\'t be empty.')) {
        hasError = true;
    }

    if (!validateField('signup-alumni-id', alumniId, 'Alumni ID can\'t be empty.')) {
        hasError = true;
    } else if (!validateField('signup-alumni-id', /^\d+$/.test(alumniId), 'Alumni ID must be a number.')) {
        hasError = true;
    }

    if (!validateField('signup-password', password.length >= 8, 'Password must be at least 8 characters.')) {
        hasError = true;
    }

    return !hasError;

}


// =========================
// PASSWORD TOGGLE
// =========================
// Uses a CSS class ("is-showing") as the single source of truth
// for which icon is visible, instead of setting inline styles.
// This avoids the icons getting out of sync with the input state.

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) return;

    const isCurrentlyHidden = input.type === 'password';

    input.type = isCurrentlyHidden ? 'text' : 'password';

    button.classList.toggle('is-showing', isCurrentlyHidden);

    button.setAttribute(
        'aria-label',
        isCurrentlyHidden ? 'Hide password' : 'Show password'
    );

}