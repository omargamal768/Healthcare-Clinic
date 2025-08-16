import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/public.css";
import profileImg from '../imges/profile.png';

const PublicHome = () => {
    // State to hold form data. 'mobile' is used consistently.
    const [formData, setFormData] = useState({
        name: '',
        mobile: '', // This will now act as 'mobile'
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

    useEffect(() => {
        // Add RTL class to body for Arabic layout
        document.body.classList.add('rtl');

        // Calculate min and max dates for the date picker
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        // Set last day of the current month as the max date for booking
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Helper to format date to YYYY-MM-DD (en-CA locale ensures this format)
        const formatDateLocal = (date) => date.toLocaleDateString('en-CA');

        setMinDate(formatDateLocal(today));
        setMaxDate(formatDateLocal(lastDayOfMonth));

        // Cleanup: remove RTL class when component unmounts
        return () => {
            document.body.classList.remove('rtl');
        };
    }, []); // Empty dependency array means this effect runs once on mount

    // --- Validation Functions ---

    const validateName = (nameValue) => {
        if (!nameValue) return "الاسم مطلوب.";
        if (nameValue.length > 30) {
            return "الاسم يجب أن لا يزيد عن 30 حرفًا.";
        }
        // Check for at least two words (name must contain a space)
        if (nameValue.trim().split(/\s+/).length < 2) {
            return "الاسم يجب أن يحتوي على كلمتين على الأقل.";
        }
        return ""; // No error
    };

    const validateMobile = (mobileValue) => {
        if (!mobileValue) return "رقم الموبايل مطلوب.";
        // Regex: starts with 010, 011, 012, or 015 AND is exactly 11 digits
        if (!/^01[0125][0-9]{8}$/.test(mobileValue)) {
            return "رقم الموبايل يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويكون 11 رقمًا.";
        }
        return ""; // No error
    };

    const validateEmail = (emailValue) => {
        if (!emailValue) return "البريد الإلكتروني مطلوب.";
        // Basic email regex for format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            return "البريد الإلكتروني غير صحيح.";
        }
        return ""; // No error
    };

    // --- Event Handlers ---

    const handleChange = (e) => {
        const { id, value } = e.target;
        let newValue = value; // Temporary variable for value

        // Specific handling for mobile to allow only digits and limit length
        if (id === 'mobile') {
            newValue = value.replace(/[^0-9]/g, ''); // Allow only digits
            if (newValue.length > 11) {
                newValue = newValue.slice(0, 11); // Truncate to 11 digits
            }
            setMobileError(''); // Clear mobile error on type (re-validate on blur/submit)
        } else if (id === 'name') {
            if (newValue.length > 30) {
                newValue = newValue.slice(0, 30); // Truncate to 30 characters
            }
            setNameError(''); // Clear name error on type
        } else if (id === 'email') {
            setEmailError(''); // Clear email error on type
        } else if (id === 'date') {
            const selectedDate = new Date(value);
            // Check if the selected day is Friday (Friday is day 5 in getDay())
            if (selectedDate.getDay() === 5) {
                alert("لا يمكن الحجز يوم الجمعة لأنه عطلة");
                newValue = ''; // Clear the invalid date
            }
        }

        // Update formData state
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

        // Perform all validations on form submission
        const nameValidationError = validateName(formData.name);
        const mobileValidationError = validateMobile(formData.mobile);
        const emailValidationError = validateEmail(formData.email);

        // Set error states for display
        setNameError(nameValidationError);
        setMobileError(mobileValidationError);
        setEmailError(emailValidationError);

        // If any validation fails, stop submission and alert user
        if (nameValidationError || mobileValidationError || emailValidationError || !formData.date) {
            alert("الرجاء مراجعة البيانات المدخلة والتأكد من صحتها.");
            return;
        }

        try {
            // Construct the request body matching the API's expected format
            const requestBody = {
                name: formData.name,
                mobile: formData.mobile, // Ensure this matches the backend's expected key
                email: formData.email,
                date: formData.date
            };

            // Send the POST request to your API endpoint
            const response = await axios.post('http://localhost:8080/api/public/orders/', requestBody);
            
            // Check for a successful response status code
            if (response.status === 200 || response.status === 201) {
                alert("تم إرسال الحجز بنجاح");
                // Clear form fields after successful submission
                setFormData({ name: '', mobile: '', email: '', date: '' });
                setNameError('');
                setMobileError('');
                setEmailError('');
            } else {
                alert("فشل إرسال الحجز: " + (response.data.message || "خطأ غير معروف"));
            }

        } catch (error) {
            // Handle API call errors (network issues, server errors, etc.)
            console.error("خطأ أثناء إرسال الحجز:", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("بيانات الخطأ من الخادم:", error.response.data);
                alert("حدث خطأ أثناء إرسال الحجز: " + (error.response.data.message || "الرجاء المحاولة مرة أخرى لاحقًا."));
            } else if (error.request) {
                // The request was made but no response was received
                console.error("لم يتم استلام رد من الخادم:", error.request);
                alert("لا يوجد اتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("خطأ في إعداد الطلب:", error.message);
                alert("حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.");
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
                                        {/* Using an external image for the map, as Google Maps embed might require API keys or proper attribution */}
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
                <div className="container-fluid">
                    <h2 className="text-center mb-4">حجز موعد</h2>
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">الاسم</label>
                            <input
                                type="text"
                                className={`form-control ${nameError ? 'is-invalid' : ''}`}
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {nameError && <div className="invalid-feedback">{nameError}</div>}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
                            <input
                                type="email" // Changed to type="email" for better browser validation
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="mobile" className="form-label">رقم الهاتف</label>
                            <input
                                type="tel" // Use type="tel" for phone numbers
                                className={`form-control ${mobileError ? 'is-invalid' : ''}`}
                                id="mobile" // Keep id as 'mobile' for consistency
                                value={formData.mobile}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {mobileError && <div className="invalid-feedback">{mobileError}</div>}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="date" className="form-label">تاريخ الحجز</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={minDate}
                                max={maxDate}
                                required
                            />
                        </div>
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-primary">حجز الآن</button>
                        </div>
                    </form>
                </div>
            </section>

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