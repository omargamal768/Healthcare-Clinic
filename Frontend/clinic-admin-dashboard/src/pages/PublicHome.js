import React, { useEffect } from 'react';
import "../styles/public.css";
import profileImg from '../imges/profile.png';

const PublicHome = () => {
  useEffect(() => {
    document.body.classList.add('rtl');
    return () => {
      document.body.classList.remove('rtl');
    };
  }, []);

  return (
    <div>
      <div id="top"></div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid">
          <a href="#top" className="navbar-brand d-flex align-items-center">
            <strong>عيادة د. جمال أبورجيلة</strong>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#clinicNavbar"
          >
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
              <img
                src={profileImg}
                className="rounded-circle shadow"
                alt="صورة دكتور جمال أبورجيلة"
                width="250"
                height="250"
                loading="lazy"
              />
              <h4 className="mt-3">د. جمال أبورجيلة</h4>
              <p className="text-muted">
                استشاري أول في علاج وجراحة المسالك البولية والكلى والبروستاتا، وأمراض الذكورة والعقم عند الرجال.
              </p>
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
          {[
            { title: "علاج أمراض الكلى", text: "تشخيص وعلاج القصور الكلوي، الالتهابات، والفشل الكلوي المزمن." },
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
          <form className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">الاسم</label>
              <input type="text" className="form-control" id="name" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">رقم الهاتف</label>
              <input type="tel" className="form-control" id="phone" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="clinic" className="form-label">اختيار العيادة</label>
              <select id="clinic" className="form-select" required>
                <option value="">اختر العيادة</option>
                <option>عيادة المطرية</option>
                <option>عيادة المرج</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="date" className="form-label">تاريخ الحجز</label>
              <input type="date" className="form-control" id="date" required />
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
