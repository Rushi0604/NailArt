import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, CalendarDays, ChevronDown, Clock3, Heart,
  Instagram, MapPin, Menu, MessageCircle, Phone, Sparkles, X,
  Settings, Plus, Trash2, Edit3, RotateCcw, Image as ImageIcon, Scissors, Save, Check, Database, ShieldCheck
} from "lucide-react";
import "./styles.css";
import { supabase } from "./supabaseClient";

const getSavedData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading localStorage key:", key, e);
  }
  return fallback;
};

function App() {
  const [gallery, setGallery] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", members: "1 Person", selectedServices: [], date: "", notes: "" });
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState("");

  // Admin state
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("gallery"); // "gallery" | "services"

  // Forms state
  const [photoForm, setPhotoForm] = useState({ id: null, title: "", category: "Luxury", image: "" });
  const [serviceForm, setServiceForm] = useState({ id: null, name: "", price: "", text: "" });

  // Admin authentication state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [tripleClickCount, setTripleClickCount] = useState(0);

  // 100% Direct Supabase PostgreSQL Data Fetching
  const fetchSupabaseData = async () => {
    setLoading(true);
    setDbError(null);

    if (!supabase) {
      setDbError("Supabase client not initialized. Check your VITE_SUPABASE_ANON_KEY in .env");
      setGallery([]);
      setServices([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch gallery items from Supabase
      const { data: galleryData, error: galleryErr } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch services items from Supabase
      const { data: servicesData, error: servicesErr } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true });

      if (galleryErr || servicesErr) {
        const err = galleryErr || servicesErr;
        console.warn("Supabase query error:", err);
        setDbError(`Supabase Notice: ${err.message}.`);
        setGallery([]);
        setServices([]);
      } else {
        // Use Supabase data directly
        setGallery(galleryData || []);
        setServices(servicesData || []);
      }
    } catch (err) {
      console.error("Supabase fetch exception:", err);
      setDbError("Unable to connect to Supabase PostgreSQL database.");
      setGallery([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load on mount & URL check for ?admin=true
  useEffect(() => {
    fetchSupabaseData();
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      setAuthModalOpen(true);
    }
  }, []);

  // Triple Click Handler: Triggers password gate after 3 clicks within 2 seconds
  const handleTripleClick = (defaultAction) => {
    setTripleClickCount(prev => {
      const nextCount = prev + 1;
      if (nextCount >= 3) {
        setAuthModalOpen(true);
        setPassInput("");
        setPassError(null);
        return 0;
      }
      return nextCount;
    });

    if (defaultAction) defaultAction();

    clearTimeout(window.tripleTimer);
    window.tripleTimer = setTimeout(() => {
      setTripleClickCount(0);
    }, 2000);
  };

  // Verify Admin Password
  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (passInput.trim() === "diya1106") {
      setAuthModalOpen(false);
      setAdminOpen(true);
      setPassInput("");
      setPassError(null);
    } else {
      setPassError("Incorrect admin password. Please try again.");
    }
  };

  // Derived categories dynamically from live gallery items
  const categories = ["All", ...Array.from(new Set(gallery.map(g => g.category || "Other")))];

  const filtered = category === "All" ? gallery : gallery.filter(g => g.category === category);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const toggleServiceSelect = (serviceLabel) => {
    setBookingForm(prev => {
      const exists = prev.selectedServices.includes(serviceLabel);
      const updated = exists
        ? prev.selectedServices.filter(s => s !== serviceLabel)
        : [...prev.selectedServices, serviceLabel];
      return { ...prev, selectedServices: updated };
    });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    const { name, phone, members, selectedServices, date, notes } = bookingForm;

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!phone || phone.replace(/\D/g, "").length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!selectedServices || selectedServices.length === 0) {
      alert("Please select at least one service.");
      return;
    }

    if (!date) {
      alert("Please select your preferred appointment date.");
      return;
    }

    const servicesText = selectedServices.join(", ");
    const adminPhone = "918320802290";
    const textMessage =
      `Hello Nail Art Box,

I would like to request an appointment booking:

Name: ${name}
Phone/WhatsApp: ${phone}
Number of People: ${members}
Services Selected: ${servicesText}
Preferred Date: ${date}
Notes/Requests: ${notes || "None"}

Please confirm my appointment slot. Thank you!`;

    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(textMessage)}`;
    setLastWhatsappUrl(whatsappUrl);

    // Open WhatsApp link immediately so browsers don't block it as an async popup
    window.open(whatsappUrl, "_blank");
    setSent(true);

    if (supabase) {
      try {
        await supabase.from("bookings").insert([{
          name,
          phone,
          members,
          service: servicesText,
          date,
          notes
        }]);
      } catch (err) {
        console.warn("Supabase booking insert notice:", err);
      }
    }
  };

  // Admin Gallery Handlers (100% Supabase)
  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.image) return;

    setIsSaving(true);
    const newItem = {
      id: photoForm.id || Date.now().toString(),
      title: photoForm.title,
      category: photoForm.category || "Custom",
      image: photoForm.image
    };

    // Optimistic UI update
    if (photoForm.id) {
      setGallery(prev => prev.map(item => item.id === photoForm.id ? newItem : item));
    } else {
      setGallery(prev => [newItem, ...prev]);
    }

    if (supabase) {
      const { error } = await supabase.from("gallery").upsert(newItem);
      if (error) {
        console.error("Supabase Save Photo Error:", error);
        alert(`Supabase Error saving photo: ${error.message}`);
      } else {
        await fetchSupabaseData();
      }
    }

    setPhotoForm({ id: null, title: "", category: "Luxury", image: "" });
    setIsSaving(false);
  };

  const handleEditPhoto = (item) => {
    setPhotoForm({ id: item.id, title: item.title, category: item.category, image: item.image });
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm("Are you sure you want to delete this photo from your Supabase database?")) {
      setIsSaving(true);
      setGallery(prev => prev.filter(item => item.id !== id));
      if (photoForm.id === id) {
        setPhotoForm({ id: null, title: "", category: "Luxury", image: "" });
      }

      if (supabase) {
        const { error } = await supabase.from("gallery").delete().eq("id", id);
        if (error) {
          console.error("Supabase Delete Photo Error:", error);
          alert(`Supabase Delete Error: ${error.message}`);
        } else {
          await fetchSupabaseData();
        }
      }
      setIsSaving(false);
    }
  };

  // Admin Services Handlers (100% Supabase)
  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.price) return;

    setIsSaving(true);
    const newItem = {
      id: serviceForm.id || Date.now().toString(),
      name: serviceForm.name,
      price: serviceForm.price,
      text: serviceForm.text
    };

    // Optimistic UI update
    if (serviceForm.id) {
      setServices(prev => prev.map(item => item.id === serviceForm.id ? newItem : item));
    } else {
      setServices(prev => [...prev, newItem]);
    }

    if (supabase) {
      const { error } = await supabase.from("services").upsert(newItem);
      if (error) {
        console.error("Supabase Save Service Error:", error);
        alert(`Supabase Error saving service: ${error.message}`);
      } else {
        await fetchSupabaseData();
      }
    }

    setServiceForm({ id: null, name: "", price: "", text: "" });
    setIsSaving(false);
  };

  const handleEditService = (item) => {
    setServiceForm({ id: item.id, name: item.name, price: item.price, text: item.text });
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service from your Supabase database?")) {
      setIsSaving(true);
      setServices(prev => prev.filter(item => item.id !== id));
      if (serviceForm.id === id) {
        setServiceForm({ id: null, name: "", price: "", text: "" });
      }

      if (supabase) {
        const { error } = await supabase.from("services").delete().eq("id", id);
        if (error) {
          console.error("Supabase Delete Service Error:", error);
          alert(`Supabase Delete Error: ${error.message}`);
        } else {
          await fetchSupabaseData();
        }
      }
      setIsSaving(false);
    }
  };


  return (
    <div className="site">
      <header className="nav">
        <button className="brand" onClick={() => handleTripleClick(() => scrollTo("home"))} title="Triple-click for Admin Access">
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>NAIL ART <em>BOX</em></span>
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <button onClick={() => scrollTo("home")}>Home</button>
          <button onClick={() => scrollTo("work")}>My Work</button>
          <button onClick={() => scrollTo("services")}>Services</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </nav>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button className="nav-book" onClick={() => setBookingOpen(true)}>
            Book Appointment <ArrowRight size={16} />
          </button>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14} /> Nail art made personal</div>
            <h1>Small details.<br /><i>Big confidence.</i></h1>
            <p>Thoughtfully designed nails for everyday elegance, special moments and everything in between.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => setBookingOpen(true)}>Book an appointment <ArrowRight size={18} /></button>
              <button className="text-btn" onClick={() => scrollTo("work")}>Explore my work <ArrowRight size={17} /></button>
            </div>
            <div className="hero-meta">
              <a
                href="https://maps.app.goo.gl/Tvty2a9xkozg1W7q9"
                target="_blank"
                rel="noreferrer"
                style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "7px" }}
              >
                <MapPin size={17} /> A-8, Jivapark Society, Isanpur
              </a>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-image-main">
              <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1100&q=90" alt="Elegant nail art" />
            </div>
            <div className="hero-card">
              <span className="mini-heart"><Heart size={15} fill="currentColor" /></span>
              <strong>Made with care</strong>
              <small>Every set is finished by hand.</small>
            </div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="section-head">
            <div>
              <div className="section-label">01 / Portfolio</div>
              <h2>A few favourites</h2>
            </div>
            <p>Browse the latest sets and find a style that feels like you.</p>
          </div>
          <div className="filters">
            {categories.map(c => (
              <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="gallery">
            {filtered.map((item, i) => (
              <article className={`gallery-item item-${i % 4}`} key={item.id || item.title + i}>
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="gallery-overlay">
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="services section" id="services">
          <div className="section-head">
            <div>
              <div className="section-label">02 / Services</div>
              <h2>Choose your set</h2>
            </div>
            <p>Prices are starting prices. Custom designs are quoted based on detail.</p>
          </div>
          <div className="service-grid">
            {services.map((s, i) => (
              <article className="service-card" key={s.id || s.name + i}>
                <div className="service-number">0{i + 1}</div>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
                <div className="service-bottom">
                  <strong>{s.price}</strong>
                  <button onClick={() => setBookingOpen(true)}>Book <ArrowRight size={15} /></button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about section" id="about">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1000&q=90" alt="Nail art close-up" />
          </div>
          <div className="about-copy">
            <div className="section-label">03 / About</div>
            <h2>Hi, I'm your<br /><i>nail artist.</i></h2>
            <p>What started as a love for tiny details became a little studio where creativity, calm and good conversation come together.</p>
            <p>I specialise in soft, feminine nail art, but I love creating something completely different when inspiration strikes.</p>
            <div className="signature">Nail Art Box <span>♡</span></div>
            <button className="primary" onClick={() => setBookingOpen(true)}>Let's create your set <ArrowRight size={18} /></button>
          </div>
        </section>

        <section className="contact section" id="contact">
          <div>
            <div className="section-label">04 / Contact</div>
            <h2>Ready for your<br /><i>next set?</i></h2>
            <p>Appointments are available by booking. For quick questions, message me directly.</p>
          </div>
          <div className="contact-list">
            <button onClick={() => setBookingOpen(true)}><span><CalendarDays /> Book an appointment</span><ArrowRight /></button>
            <a href="https://maps.app.goo.gl/Tvty2a9xkozg1W7q9" target="_blank" rel="noreferrer">
              <span><MapPin style={{ width: "18px" }} /> A-8, Jivapark Society, Isanpur</span>
              <ArrowRight />
            </a>
            <a href="https://wa.me/918320802290" target="_blank" rel="noreferrer"><span><MessageCircle /> WhatsApp (+91 83208 02290)</span><ArrowRight /></a>
            <a href="https://www.instagram.com/nail_art.box?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer"><span><Instagram /> Instagram (@nail_art.box)</span><ArrowRight /></a>
            <a href="tel:+918320802290"><span><Phone /> +91 83208 02290</span><ArrowRight /></a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand" onClick={() => handleTripleClick()} style={{ cursor: "pointer" }} title="Triple click for Admin Panel">
          NAIL ART <em>BOX</em>
        </div>
        <p>© 2026 Nail Art Box. Made with care.</p>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button onClick={() => handleTripleClick()} style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
            <Settings size={14} /> Admin Panel
          </button>
          <button onClick={() => scrollTo("home")}>Back to top ↑</button>
        </div>
      </footer>

      {/* ADMIN PASSWORD VERIFICATION MODAL */}
      {authModalOpen && (
        <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="booking-modal" style={{ maxWidth: "440px" }} onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setAuthModalOpen(false)}><X /></button>
            <div className="section-label">Restricted Area</div>
            <h2 style={{ fontSize: "32px", margin: "8px 0" }}>Admin <i>Access</i></h2>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>Enter admin password to unlock workspace.</p>

            <form onSubmit={handleVerifyPassword} style={{ marginTop: "20px", display: "grid", gap: "15px" }}>
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  placeholder="Enter admin password"
                  value={passInput}
                  onChange={e => { setPassInput(e.target.value); setPassError(null); }}
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--line)", background: "white", outline: "none" }}
                />
              </div>

              {passError && (
                <div style={{ color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: "2px", fontSize: "12px" }}>
                  {passError}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="primary" type="submit" style={{ flex: 1 }}>
                  Unlock Admin Panel <ArrowRight size={16} />
                </button>
                <button className="secondary-btn" type="button" onClick={() => setAuthModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER BOOKING MODAL */}
      {bookingOpen && (
        <div className="modal-backdrop" onClick={() => setBookingOpen(false)}>
          <div className="booking-modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setBookingOpen(false)}><X /></button>
            {!sent ? (
              <>
                <div className="section-label">Appointment</div>
                <h2>Let's book your <i>set.</i></h2>
                <p>Send your preferred details and I'll get back to you to confirm the slot.</p>
                <form onSubmit={submitBooking}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <input
                      required
                      placeholder="Your name"
                      value={bookingForm.name}
                      onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                    />
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      placeholder="Phone (10 digits)"
                      value={bookingForm.phone}
                      onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    />
                  </div>

                  <div style={{ marginTop: "4px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>
                      Number of People:
                    </label>
                    <select
                      required
                      value={bookingForm.members}
                      onChange={e => setBookingForm({ ...bookingForm, members: e.target.value })}
                    >
                      <option value="1 Person">1 Person (Solo Appointment)</option>
                      <option value="2 People">2 People (Duo)</option>
                      <option value="3 People">3 People</option>
                      <option value="4+ People (Group)">4+ People (Group Booking)</option>
                    </select>
                  </div>

                  <div style={{ marginTop: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>
                      Select Services (Click to select multiple):
                    </label>
                    <div className="service-pills-grid">
                      {services.map(s => {
                        const label = `${s.name} (${s.price})`;
                        const isSelected = bookingForm.selectedServices.includes(label);
                        return (
                          <button
                            type="button"
                            key={s.id || s.name}
                            className={isSelected ? "service-pill active" : "service-pill"}
                            onClick={() => toggleServiceSelect(label)}
                          >
                            {isSelected ? <Check size={13} /> : <Plus size={13} />} {s.name} <span style={{ opacity: 0.8, fontSize: "11px" }}>{s.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginTop: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>
                      Preferred Appointment Date:
                    </label>
                    <input
                      required
                      type="date"
                      value={bookingForm.date}
                      onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                    />
                  </div>

                  <textarea
                    rows="3"
                    placeholder="Tell me about your design idea or any special requests."
                    value={bookingForm.notes}
                    onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  />

                  <button className="primary" type="submit" style={{ width: "100%", marginTop: "5px" }}>
                    Send Request via WhatsApp <MessageCircle size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="success">
                <span className="success-icon"><Heart size={25} fill="currentColor" /></span>
                <h2>Booking Sent! <i>♡</i></h2>
                <p>Your appointment request for <strong>{bookingForm.members}</strong> ({bookingForm.selectedServices.length} service{bookingForm.selectedServices.length > 1 ? "s" : ""}) has been recorded!</p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
                  {lastWhatsappUrl && (
                    <a className="primary" href={lastWhatsappUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <MessageCircle size={17} /> Open WhatsApp Chat
                    </a>
                  )}
                  <button className="secondary-btn" onClick={() => { setSent(false); setBookingOpen(false); setBookingForm({ name: "", phone: "", members: "1 Person", selectedServices: [], date: "", notes: "" }); }}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN MANAGEMENT MODAL */}
      {adminOpen && (
        <div className="modal-backdrop" onClick={() => setAdminOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-top-bar">
              <div>
                <div className="section-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>Management Workspace</span>
                  <span className="admin-badge" style={{ background: "#dcfce7", color: "#166534", textTransform: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Database size={11} /> Supabase Live
                  </span>
                </div>
                <h2>Admin <i>Panel</i></h2>
              </div>
              <div className="admin-top-bar-actions">
                <button className="reset-btn" onClick={fetchSupabaseData} title="Re-sync data from Supabase PostgreSQL DB">
                  <RotateCcw size={14} /> Sync DB
                </button>
                <button className="close" onClick={() => setAdminOpen(false)} aria-label="Close admin modal">
                  <X size={24} />
                </button>
              </div>
            </div>

            {dbError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "12px 16px", borderRadius: "4px", fontSize: "12px", marginBottom: "20px" }}>
                <strong>Database Alert:</strong> {dbError}
              </div>
            )}

            <div className="admin-tabs">
              <button
                className={adminTab === "gallery" ? "admin-tab active" : "admin-tab"}
                onClick={() => setAdminTab("gallery")}
              >
                <ImageIcon size={16} /> Manage Photos & Gallery ({gallery.length})
              </button>
              <button
                className={adminTab === "services" ? "admin-tab active" : "admin-tab"}
                onClick={() => setAdminTab("services")}
              >
                <Scissors size={16} /> Manage Services ({services.length})
              </button>
            </div>

            {/* TAB 1: GALLERY MANAGEMENT */}
            {adminTab === "gallery" && (
              <div className="admin-panel-grid">
                {/* Form Column */}
                <div className="admin-form-card">
                  <h3>
                    {photoForm.id ? "Edit Photo" : "Add New Photo"}
                    {photoForm.id && (
                      <button className="text-btn" style={{ fontSize: "12px" }} onClick={() => setPhotoForm({ id: null, title: "", category: "Luxury", image: "" })}>
                        + New
                      </button>
                    )}
                  </h3>
                  <form className="admin-form" onSubmit={handleSavePhoto}>
                    <label>
                      Title
                      <input
                        type="text"
                        required
                        placeholder="e.g. Blush Pearl Set"
                        value={photoForm.title}
                        onChange={e => setPhotoForm({ ...photoForm, title: e.target.value })}
                      />
                    </label>
                    <label>
                      Category
                      <input
                        type="text"
                        required
                        placeholder="e.g. Luxury, Bridal, Simple..."
                        value={photoForm.category}
                        onChange={e => setPhotoForm({ ...photoForm, category: e.target.value })}
                      />
                    </label>
                    <label>
                      Image URL
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={photoForm.image}
                        onChange={e => setPhotoForm({ ...photoForm, image: e.target.value })}
                      />
                    </label>

                    {photoForm.image && (
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Image Preview:</span>
                        <img
                          src={photoForm.image}
                          alt="Preview"
                          className="img-preview"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80"; }}
                        />
                      </div>
                    )}

                    <div className="form-actions">
                      <button className="primary" type="submit" style={{ flex: 1 }}>
                        <Save size={15} /> {photoForm.id ? "Update Photo" : "Add Photo"}
                      </button>
                      {photoForm.id && (
                        <button className="secondary-btn" type="button" onClick={() => setPhotoForm({ id: null, title: "", category: "Luxury", image: "" })}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List Column */}
                <div className="admin-items-list">
                  {gallery.map(item => (
                    <div className="admin-item-card" key={item.id}>
                      <div className="admin-item-info">
                        <img src={item.image} alt={item.title} className="admin-item-thumb" />
                        <div className="admin-item-details">
                          <strong>{item.title}</strong>
                          <span className="admin-badge">{item.category}</span>
                          <p style={{ fontSize: "11px", wordBreak: "break-all", marginTop: "4px" }}>{item.image.slice(0, 45)}...</p>
                        </div>
                      </div>
                      <div className="admin-item-actions">
                        <button className="edit-btn" onClick={() => handleEditPhoto(item)}>
                          <Edit3 size={14} /> Edit
                        </button>
                        <button className="danger-btn" onClick={() => handleDeletePhoto(item.id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {gallery.length === 0 && (
                    <p style={{ color: "var(--muted)", textAlign: "center", padding: "40px 0" }}>No photos in portfolio. Add one using the form!</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SERVICES MANAGEMENT */}
            {adminTab === "services" && (
              <div className="admin-panel-grid">
                {/* Form Column */}
                <div className="admin-form-card">
                  <h3>
                    {serviceForm.id ? "Edit Service" : "Add New Service"}
                    {serviceForm.id && (
                      <button className="text-btn" style={{ fontSize: "12px" }} onClick={() => setServiceForm({ id: null, name: "", price: "", text: "" })}>
                        + New
                      </button>
                    )}
                  </h3>
                  <form className="admin-form" onSubmit={handleSaveService}>
                    <label>
                      Service Name
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gel Extensions"
                        value={serviceForm.name}
                        onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                      />
                    </label>
                    <label>
                      Starting Price
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹899 or ₹1,299+"
                        value={serviceForm.price}
                        onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })}
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        rows="3"
                        required
                        placeholder="Short description of what is included in this service..."
                        value={serviceForm.text}
                        onChange={e => setServiceForm({ ...serviceForm, text: e.target.value })}
                      />
                    </label>

                    <div className="form-actions">
                      <button className="primary" type="submit" style={{ flex: 1 }}>
                        <Save size={15} /> {serviceForm.id ? "Update Service" : "Add Service"}
                      </button>
                      {serviceForm.id && (
                        <button className="secondary-btn" type="button" onClick={() => setServiceForm({ id: null, name: "", price: "", text: "" })}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List Column */}
                <div className="admin-items-list">
                  {services.map((service, index) => (
                    <div className="admin-item-card" key={service.id || index}>
                      <div className="admin-item-info">
                        <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "var(--soft)", display: "grid", placeItems: "center", color: "var(--rose-dark)", fontWeight: "600", fontSize: "12px" }}>
                          0{index + 1}
                        </div>
                        <div className="admin-item-details">
                          <strong>{service.name} <span style={{ color: "var(--rose-dark)", fontFamily: "DM Sans, sans-serif", fontSize: "15px", fontWeight: "600", marginLeft: "8px" }}>({service.price})</span></strong>
                          <p>{service.text}</p>
                        </div>
                      </div>
                      <div className="admin-item-actions">
                        <button className="edit-btn" onClick={() => handleEditService(service)}>
                          <Edit3 size={14} /> Edit
                        </button>
                        <button className="danger-btn" onClick={() => handleDeleteService(service.id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {services.length === 0 && (
                    <p style={{ color: "var(--muted)", textAlign: "center", padding: "40px 0" }}>No services available. Add one using the form!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);