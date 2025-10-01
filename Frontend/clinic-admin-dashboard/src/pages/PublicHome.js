import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../components/Popup'; // Import the Popup component
import "../styles/public.css";
import profileImg from '../imges/profile.png';

const PublicHome = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        date: ''
    });

    // States for min and max dates for the date input
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');

    // States for validation errors
    const [nameError, setNameError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [emailError, setEmailError] = useState('');

    // --- New States for the Popup ---
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState({
        title: '',
        body: '',
        type: '' // 'success' or 'error'
    });

    useEffect(() => {
        document.body.classList.add('rtl');
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const formatDateLocal = (date) => date.toLocaleDateString('en-CA');

        setMinDate(formatDateLocal(today));
        setMaxDate(formatDateLocal(lastDayOfMonth));

        return () => {
            document.body.classList.remove('rtl');
        };
    }, []);

    // Helper function to show the popup
    const showPopup = (title, message, type) => {
        setPopupMessage({ title, body: message, type });
        setIsPopupVisible(true);
    };

    // Helper function to close the popup
    const closePopup = () => {
        setIsPopupVisible(false);
    };

    // --- Validation Functions ---
    const validateName = (nameValue) => {
        if (!nameValue) return "الاسم مطلوب.";
        if (nameValue.length > 30) {
            return "الاسم يجب أن لا يزيد عن 30 حرفًا.";
        }
        if (nameValue.trim().split(/\s+/).length < 2) {
            return "الاسم يجب أن يحتوي على كلمتين على الأقل.";
        }
        return "";
    };

    const validateMobile = (mobileValue) => {
        if (!mobileValue) return "رقم الموبايل مطلوب.";
        if (!/^01[0125][0-9]{8}$/.test(mobileValue)) {
            return "رقم الموبايل يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويكون 11 رقمًا.";
        }
        return "";
    };

    const validateEmail = (emailValue) => {
        if (!emailValue) return "البريد الإلكتروني مطلوب.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            return "البريد الإلكتروني غير صحيح.";
        }
        return "";
    };

    // --- Event Handlers ---
    const handleChange = (e) => {
        const { id, value } = e.target;
        let newValue = value;

        if (id === 'mobile') {
            newValue = value.replace(/[^0-9]/g, '');
            if (newValue.length > 11) {
                newValue = newValue.slice(0, 11);
            }
            setMobileError('');
        } else if (id === 'name') {
            if (newValue.length > 30) {
                newValue = newValue.slice(0, 30);
            }
            setNameError('');
        } else if (id === 'email') {
            setEmailError('');
        } else if (id === 'date') {
            const selectedDate = new Date(value);
            if (selectedDate.getDay() === 5) {
                showPopup("خطأ في التاريخ", "لا يمكن الحجز يوم الجمعة لأنه عطلة.", 'error');
                newValue = '';
            }
        }
        setFormData(prev => ({ ...prev, [id]: newValue }));
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        if (id === 'name') {
            setNameError(validateName(value));
        } else if (id === 'mobile') {
            setMobileError(validateMobile(value));
        } else if (id === 'email') {
            setEmailError(validateEmail(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameValidationError = validateName(formData.name);
        const mobileValidationError = validateMobile(formData.mobile);
        const emailValidationError = validateEmail(formData.email);

        setNameError(nameValidationError);
        setMobileError(mobileValidationError);
        setEmailError(emailValidationError);

        if (nameValidationError || mobileValidationError || emailValidationError || !formData.date) {
            showPopup("خطأ في البيانات", "الرجاء مراجعة البيانات المدخلة والتأكد من صحتها.", 'error');
            return;
        }

        try {
            const requestBody = {
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                date: formData.date
            };

            const response = await axios.post('http://localhost:8080/api/public/orders/', requestBody);

            if (response.status === 200 || response.status === 201) {
                showPopup("تم الحجز بنجاح", "تم إرسال الحجز بنجاح.", 'success');
                setFormData({ name: '', mobile: '', email: '', date: '' });
                setNameError('');
                setMobileError('');
                setEmailError('');
            } else {
                showPopup("فشل الحجز", "فشل إرسال الحجز: " + (response.data.message || "خطأ غير معروف"), 'error');
            }

        } catch (error) {
            console.error("خطأ أثناء إرسال الحجز:", error);
            if (error.response) {
                showPopup("خطأ من الخادم", "حدث خطأ أثناء إرسال الحجز: " + (error.response.data.message || "الرجاء المحاولة مرة أخرى لاحقًا."), 'error');
            } else if (error.request) {
                showPopup("خطأ في الاتصال", "لا يوجد اتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت.", 'error');
            } else {
                showPopup("خطأ غير متوقع", "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.", 'error');
            }
        }
    };

    return (
        <div className="public-home bodyy">
            <div id="top"></div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
                <div className="container-fluid">
                    <a href="#top" className="navbar-brand d-flex align-items-center">
                        <strong>عيادة د. جمال أبورجيلة</strong>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#clinicNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="clinicNavbar">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item"><a className="nav-link active" href="#about">نبذة</a></li>
                            <li className="nav-item"><a className="nav-link" href="#services">الخدمات</a></li>
                            <li className="nav-item"><a className="nav-link" href="#clinics">العيادات</a></li>
                            <li className="nav-item"><a className="nav-link" href="#booking">الحجز</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* About Section */}
            <section id="about" className="py-5 bg-light">
                <div className="container-fluid">
                    <h2 className="text-center mb-4">نبذة عن الطبيب</h2>
                    <div className="row align-items-start flex-row-reverse">
                        <div className="col-md-4 text-center mb-3">
                            <img src={profileImg} className="rounded-circle shadow" alt="صورة دكتور جمال أبورجيلة" width="250" height="250" loading="lazy" />
                            <h4 className="mt-3">د. جمال أبورجيلة</h4>
                            <p className="text-muted">استشاري أول في علاج وجراحة المسالك البولية والكلى والبروستاتا، وأمراض الذكورة والعقم عند الرجال.</p>
                        </div>
                        <div className="col-md-8">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">📜 البورد الأوروبي لجراحة الكلى والمسالك البولية - هولندا</li>
                                <li className="list-group-item">🎓 دكتوراة الكلى والمسالك البولية - جامعة الأزهر</li>
                                <li className="list-group-item">🏅 البورد المصري للمسالك والتناسلية والذكورة</li>
                                <li className="list-group-item">🎓 ماجستير المسالك البولية - قصر العيني</li>
                                <li className="list-group-item">🏥 استشاري أول بمستشفيات العاصمة والدعاء والرحمة</li>
                                <li className="list-group-item">💥 متخصص في تفتيت الحصوات بالموجات التصادمية والمنظار</li>
                                <li className="list-group-item">🧬 علاج الضعف الجنسي، دعامات القضيب، سرعة القذف، واستئصال الدوالي</li>
                                <li className="list-group-item">🧫 علاج أورام المثانة</li>
                                <li className="list-group-item">🏛 يعمل بالمعهد القومي للكلى والمسالك البولية</li>
                                <li className="list-group-item">💰 أسعار العمليات تشمل أجر الجراح فقط</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="container-fluid py-5">
                <h2 className="text-center mb-4">الخدمات الطبية</h2>
                <div className="row g-4">
                    {[{ title: "علاج أمراض الكلى", text: "تشخيص وعلاج القصور الكلوي، الالتهابات، والفشل الكلوي المزمن." },
                    { title: "حصوات الكلى والمثانة", text: "علاج الحصوات بالأدوية أو الموجات التصادمية أو التدخل الجراحي البسيط." },
                    { title: "أمراض الذكورة والعقم", text: "علاج ضعف الانتصاب والعقم عند الرجال باستخدام أحدث البروتوكولات." }
                    ].map((service, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card h-100 border-0 shadow-sm text-center">
                                <div className="card-body">
                                    <h5 className="card-title">{service.title}</h5>
                                    <p className="card-text">{service.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Clinics Section */}
            <section id="clinics" className="container py-5">
                <h2 className="text-center mb-5 text-primary fw-bold">أماكن وعناوين العيادات</h2>
                <div className="row g-4">
                    {[
                        {
                            title: "عيادة مصر الجديدة",
                            address: "٣ شارع دمنهور، متفرع من شارع هارون الرشيد، بالقرب من ميدان صلاح الدين، مصر الجديدة، القاهرة",
                            phone: "01280576720",
                            coords: "30.0965551,31.3310337",
                            workingHours: "من السبت إلى الخميس من الساعة 5 مساءً إلى 7 مساءً"
                        },
                        {
                            title: "عيادة ميدان المطرية",
                            address: "ميدان المطرية، أبراج العز، برج (ا)، الدور الثاني، شقة ٢١٥",
                            phone: "01063432743",
                            coords: "30.1152462,31.3053494",
                            workingHours: "من السبت إلى الخميس من الساعة 8 مساءً إلى 11 مساءً"
                        }
                    ].map((clinic, i) => (
                        <div className="col-md-6" key={i}>
                            <div className="card clinic-card border-0 shadow-sm h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title text-dark fw-bold mb-3">{clinic.title}</h5>
                                    <p className="card-text text-secondary mb-2">
                                        <i className="bi bi-geo-alt-fill text-primary me-2"></i>{clinic.address}
                                    </p>
                                    <p className="card-text mb-2">
                                        <i className="bi bi-telephone-fill text-success me-2"></i>
                                        <strong>رقم الهاتف:</strong> {clinic.phone}
                                    </p>
                                    <p className="card-text mb-3">
                                        <i className="bi bi-clock-fill text-warning me-2"></i>
                                        <strong>مواعيد العمل:</strong> {clinic.workingHours}
                                    </p>
                                    <div className="location rounded overflow-hidden shadow-sm mb-3">
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${clinic.coords}&z=15&output=embed`}
                                            width="100%"
                                            height="200"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            title={clinic.title}
                                        ></iframe>
                                    </div>
                                    <a
                                        href={`https://wa.me/2${clinic.phone.replace(/^0/, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success mt-auto w-100"
                                    >
                                        <i className="bi bi-whatsapp me-2"></i> تواصل عبر واتساب
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Booking Section */}
            <section id="booking" className="bg-light py-5">
                <div className="container">
                    <h2 className="text-center mb-4">حجز موعد</h2>
                    <form className="row g-3 justify-content-center" onSubmit={handleSubmit}>
                        <div className="col-md-4">
                            <label htmlFor="name" className="form-label">الاسم</label>
                            <input
                                type="text"
                                className={`form-control form-control-sm ${nameError ? 'is-invalid' : ''}`}
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {nameError && <div className="invalid-feedback">{nameError}</div>}
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
                            <input
                                type="email"
                                className={`form-control form-control-sm ${emailError ? 'is-invalid' : ''}`}
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="mobile" className="form-label">رقم الهاتف</label>
                            <input
                                type="tel"
                                className={`form-control form-control-sm ${mobileError ? 'is-invalid' : ''}`}
                                id="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {mobileError && <div className="invalid-feedback">{mobileError}</div>}
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="date" className="form-label">تاريخ الحجز</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                id="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={minDate}
                                max={maxDate}
                                required
                            />
                        </div>
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-primary px-4">حجز الآن</button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Popup Component - rendered at the top level of the app */}
            <Popup isVisible={isPopupVisible} onClose={closePopup}>
                {popupMessage.type === 'success' ? (
                    <div className="text-center">
                        <h4 className="text-success mb-3">✅ {popupMessage.title}</h4>
                        <p>{popupMessage.body}</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <h4 className="text-danger mb-3">❌ {popupMessage.title}</h4>
                        <p>{popupMessage.body}</p>
                    </div>
                )}
            </Popup>

            {/* Footer */}
            <footer className="text-center mt-5 py-4 bg-white shadow-sm">
                <div className="container-fluid">
                    <p className="mb-2">© 2025 جميع الحقوق محفوظة للدكتور جمال أبورجيلة</p>
                    <div>
                        <a href="#about">نبذة</a> | <a href="#services">الخدمات</a> | <a href="#clinics">العيادات</a> | <a href="#booking">الحجز</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicHome;