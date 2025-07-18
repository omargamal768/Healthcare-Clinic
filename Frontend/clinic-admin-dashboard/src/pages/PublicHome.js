import React from 'react';
import "../styles/public.css";
import { HashLink as Link } from 'react-router-hash-link';

const PublicHome = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src="https://via.placeholder.com/40x40?text=🏥"
              alt="عيادة"
              width="40"
              height="40"
              className="me-2"
            />
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
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link smooth className="nav-link active" to="#about">نبذة</Link>
              </li>
              <li className="nav-item">
                <Link smooth className="nav-link" to="#services">الخدمات</Link>
              </li>
              <li className="nav-item">
                <Link smooth className="nav-link" to="#clinics">العيادات</Link>
              </li>
              <li className="nav-item">
                <Link smooth className="nav-link" to="#booking">الحجز</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <div className="container-fluid">
          <h2 className="text-center mb-4">نبذة عن الطبيب</h2>
          <div className="row align-items-start">
            <div className="col-md-4 text-center mb-3">
              <img
                src="https://via.placeholder.com/250x250?text=د.جمال+أبورجيلة"
                className="rounded-circle shadow"
                alt="دكتور جمال"
                width="250"
                height="250"
              />
              <h4 className="mt-3">د. جمال أبورجيلة</h4>
              <p className="text-muted">
                استشاري اول علاج و جراحة المسالك البولية و الكلى و البروستاتة استشاري اول علاج أمراض و جراحة الذكورة و العقم عند الرجال
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
                <li className="list-group-item">🧬 استشاري علاج الضعف الجنسي، دعامات القضيب، سرعة القذف، واستئصال الدوالي</li>
                <li className="list-group-item">🧫 علاج أورام المثانة</li>
                <li className="list-group-item">🏛 يعمل بالمعهد القومي للكلى والمسالك البولية</li>
                <li className="list-group-item">💰 أسعار العمليات تشمل أجر الجراح فقط</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container-fluid" id="services">
        <h2 className="text-center mb-4">الخدمات الطبية</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">علاج أمراض الكلى</h5>
                <p className="card-text">تشخيص وعلاج القصور الكلوي، الالتهابات، والفشل الكلوي المزمن.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">حصوات الكلى والمثانة</h5>
                <p className="card-text">علاج الحصوات بالأدوية أو الموجات التصادمية أو التدخل الجراحي البسيط.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">أمراض الذكورة والعقم</h5>
                <p className="card-text">علاج ضعف الانتصاب والعقم عند الرجال باستخدام أحدث البروتوكولات.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinics Section */}
      <section className="container-fluid" id="clinics">
        <h2 className="text-center mb-4">أماكن وعناوين العيادات</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">عيادة المطرية</h5>
                <p className="card-text">شارع المطراوي، المطرية، القاهرة</p>
                <div className="location">
                  <iframe
                    src="https://www.google.com/maps?q=30.127174,31.291936&z=15&output=embed"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="عيادة المطرية"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">عيادة المرج</h5>
                <p className="card-text">شارع محطة المرج، المرج، القاهرة</p>
                <div className="location">
                  <iframe
                    src="https://www.google.com/maps?q=30.161869,31.340011&z=15&output=embed"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="عيادة المرج"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="bg-light" id="booking">
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
            <a href="#about">نبذة عن الطبيب</a> |
            <a href="#services">الخدمات</a> |
            <a href="#clinics">العيادات</a> |
            <a href="#booking">الحجز</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
