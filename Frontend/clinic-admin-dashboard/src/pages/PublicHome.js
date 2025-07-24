
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/public.css";
import profileImg from '../imges/profile.png';

const PublicHome = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '', // This will now act as 'mobile' from AddPatient
    clinic: '',
    date: ''
  });

  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  // States for name and phone errors, mirroring AddPatient
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  // mobileExistsError is not needed here as public form won't check uniqueness against all patients
  // const [mobileExistsError, setMobileExistsError] = useState('');


useEffect(() => {
  document.body.classList.add('rtl');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const lastDayOfMonth = new Date(year, month + 1, 0); // correct last day of current month

  const formatDateLocal = (date) => date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

  setMinDate(formatDateLocal(today));
  setMaxDate(formatDateLocal(lastDayOfMonth));

  return () => {
    document.body.classList.remove('rtl');
  };
}, []);



  // --- START: Validation functions adapted from AddPatient ---

  const validateName = (nameValue) => {
    if (!nameValue) return "الاسم مطلوب.";
    if (nameValue.length > 30) {
      return "الاسم يجب أن لا يزيد عن 30 حرفًا.";
    }
    // Check for at least two words
    if (nameValue.trim().split(/\s+/).length < 2) {
      return "الاسم يجب أن يحتوي على كلمتين على الأقل.";
    }
    return "";
  };

  const validatePhone = (mobileValue) => {
    if (!mobileValue) return "رقم الموبايل مطلوب.";
    // Regex: starts with 010, 011, 012, or 015 AND is exactly 11 digits
    if (!/^01[0125][0-9]{8}$/.test(mobileValue)) {
      return "رقم الموبايل يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويكون 11 رقمًا.";
    }
    return "";
  };

  // --- END: Validation functions adapted from AddPatient ---


  const handleChange = (e) => {
    const { id, value } = e.target;
    let newFormData = { ...formData, [id]: value };
    let currentNameError = nameError;
    let currentPhoneError = phoneError;

    if (id === 'name') {
      // Real-time truncation and error for name (max 30 characters)
      if (value.length > 30) {
        currentNameError = "الاسم يجب أن لا يزيد عن 30 حرفًا.";
        newFormData = { ...newFormData, [id]: value.slice(0, 30) };
      } else {
        currentNameError = ''; // Clear error if within bounds
        newFormData = { ...newFormData, [id]: value };
      }
      setNameError(currentNameError);
      setFormData(newFormData);

    } else if (id === 'phone') {
      let tempPhoneValue = value;

      // Ensure only digits are entered
      if (!/^[0-9]*$/.test(tempPhoneValue)) {
          setPhoneError("رقم الموبايل يجب أن يحتوي على أرقام فقط.");
          return; // Stop processing if non-digit found
      }

      // --- Start of stricter prefix enforcement ---

      if (tempPhoneValue.length > 0) {
          // Rule 1: First digit must be '0'
          if (tempPhoneValue.length === 1 && tempPhoneValue !== '0') {
              setPhoneError("رقم الموبايل يجب أن يبدأ بـ 0.");
              setFormData(prev => ({ ...prev, [id]: '' })); // Clear the input field
              return;
          }
          // Rule 2: Second digit must be '1' if first is '0'
          if (tempPhoneValue.length === 2 && !/^01$/.test(tempPhoneValue)) {
              setPhoneError("رقم الموبايل يجب أن يبدأ بـ 01.");
              setFormData(prev => ({ ...prev, [id]: tempPhoneValue.slice(0, 1) })); // Keep just the '0'
              return;
          }
          // Rule 3: Third digit must be 0, 1, 2, or 5 if first two are '01'
          if (tempPhoneValue.length === 3 && !/^01[0125]$/.test(tempPhoneValue)) {
              setPhoneError("رقم الموبايل يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015.");
              setFormData(prev => ({ ...prev, [id]: tempPhoneValue.slice(0, 2) })); // Keep just the '01'
              return;
          }
          // If a character makes the prefix invalid, it's immediately rejected above.
          // So, if we reach here, the prefix is valid so far.
          currentPhoneError = ""; // Clear any previous prefix error if valid.
      } else {
          currentPhoneError = "رقم الموبايل مطلوب."; // If field becomes empty
      }

      // --- End of stricter prefix enforcement ---

      // Truncate if more than 11 digits
      if (tempPhoneValue.length > 11) {
        tempPhoneValue = tempPhoneValue.slice(0, 11);
        currentPhoneError = "رقم الموبايل يجب أن يكون 11 رقمًا بالضبط.";
      } 
      // Do not clear currentPhoneError here if it's already set by prefix rules.
      // The condition `tempPhoneValue.length < 11` combined with `tempPhoneValue.length > 0`
      // below means we are checking for length, but the prefix errors should take precedence.
      // So, if `currentPhoneError` is already set by the prefix, don't clear it here.
      else if (tempPhoneValue.length > 0 && tempPhoneValue.length < 11 && currentPhoneError === "") {
        currentPhoneError = "رقم الموبايل يجب أن يكون 11 رقمًا."; // More specific error for length
      }


      // If the input is exactly 11 digits and no prefix/length error, perform the full regex validation
      if (tempPhoneValue.length === 11 && currentPhoneError === '') {
        const fullValidationResult = validatePhone(tempPhoneValue);
        if (fullValidationResult) {
            currentPhoneError = fullValidationResult;
        }
      }

      setFormData(prev => ({ ...prev, [id]: tempPhoneValue }));
      setPhoneError(currentPhoneError);


    } else if (id === 'date') {
      const selectedDate = new Date(value);
      const day = selectedDate.getDay(); // 5 = Friday
      if (day === 5) {
        alert("لا يمكن الحجز يوم الجمعة لأنه عطلة");
        setFormData(prev => ({ ...prev, [id]: '' })); // Clear the invalid date
        return;
      }
      setFormData(prev => ({ ...prev, [id]: value }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (id === 'name') {
      const error = validateName(value);
      setNameError(error);
    } else if (id === 'phone') {
      const error = validatePhone(value); // Use the comprehensive validation on blur
      setPhoneError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run all validations on submission
    const nameValidationError = validateName(formData.name);
    const phoneValidationError = validatePhone(formData.phone);

    setNameError(nameValidationError);
    setPhoneError(phoneValidationError);

    // Check if form is valid before submitting
    if (nameValidationError || phoneValidationError || !formData.date || !formData.clinic) {
      alert("الرجاء مراجعة البيانات المدخلة والتأكد من صحتها.");
      return;
    }

    try {
      const requestBody = {
        name: formData.name,
        mobile: formData.phone, // Ensure backend expects 'mobile'
        clinicName: formData.clinic,
        date: formData.date
      };

      await axios.post('http://localhost:8080/api/public/reserve', requestBody);
      alert("تم إرسال الحجز بنجاح");
      // Clear form after successful submission
      setFormData({ name: '', phone: '', clinic: '', date: '' });
      setNameError('');
      setPhoneError('');
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الحجز");
      console.error(error);
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

      {/* About */}
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

      {/* Services */}
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

      {/* Clinics */}
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
                      src={`https://www.google.com/maps?q=${clinic.coords}&z=15&output=embed`}
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


      {/* Booking */}
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
              <label htmlFor="phone" className="form-label">رقم الهاتف</label>
              <input
                type="tel" // Use type="tel" for phone numbers
                className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {phoneError && <div className="invalid-feedback">{phoneError}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="clinic" className="form-label">اختيار العيادة</label>
              <select id="clinic" className="form-select" value={formData.clinic} onChange={handleChange} required>
                <option value="">اختر العيادة</option>
                <option value="المطرية">عيادة المطرية</option>
                <option value="مصر الجديدة">عيادة مصر الجديدة</option>
              </select>
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
