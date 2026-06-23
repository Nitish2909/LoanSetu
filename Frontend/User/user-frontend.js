   // CONFIG — change to your deployed backend URL
      // const API_BASE = "http://localhost:5000/api";
      const API_BASE = "https://loansetu-soqg.onrender.com/api";

      const LOANS = [
        {
          key: "home",
          title: "Home Loan",
          icon: "🏠",
          desc: "Buy or build your dream home",
          rate: "8.40% p.a.",
        },
        {
          key: "car",
          title: "Car Loan",
          icon: "🚗",
          desc: "Drive home your favourite car",
          rate: "8.75% p.a.",
        },
        {
          key: "personal",
          title: "Personal Loan",
          icon: "💵",
          desc: "For any personal need",
          rate: "10.50% p.a.",
        },
        {
          key: "education",
          title: "Education Loan",
          icon: "🎓",
          desc: "Fund your higher studies",
          rate: "8.90% p.a.",
        },
        {
          key: "business",
          title: "Business Loan",
          icon: "💼",
          desc: "Grow your business faster",
          rate: "11.00% p.a.",
        },
        {
          key: "gold",
          title: "Gold Loan",
          icon: "🪙",
          desc: "Instant loan against gold",
          rate: "9.00% p.a.",
        },
        {
          key: "land",
          title: "Land/Plot Loan",
          icon: "🌳",
          desc: "Buy residential plot",
          rate: "8.65% p.a.",
        },
        {
          key: "two-wheeler",
          title: "Two-Wheeler Loan",
          icon: "🏍️",
          desc: "Own your dream bike",
          rate: "9.50% p.a.",
        },
        {
          key: "loan-against-property",
          title: "Loan Against Property",
          icon: "🏢",
          desc: "Unlock property value",
          rate: "9.25% p.a.",
        },
        {
          key: "agriculture",
          title: "Agriculture Loan",
          icon: "🌾",
          desc: "For farmers & agri needs",
          rate: "7.00% p.a.",
        },
        {
          key: "medical",
          title: "Medical Loan",
          icon: "🏥",
          desc: "Healthcare emergencies",
          rate: "10.75% p.a.",
        },
        {
          key: "travel",
          title: "Travel Loan",
          icon: "✈️",
          desc: "Plan your perfect vacation",
          rate: "11.25% p.a.",
        },
      ];

      const BANKS = [
        "State Bank of India",
        "HDFC Bank",
        "ICICI Bank",
        "Axis Bank",
        "Punjab National Bank",
        "Bank of Baroda",
        "Canara Bank",
        "Union Bank of India",
        "Kotak Mahindra",
        "IndusInd Bank",
        "Yes Bank",
        "IDFC First Bank",
        "Federal Bank",
        "RBL Bank",
        "IDBI Bank",
        "Bank of India",
        "Central Bank of India",
        "Indian Bank",
        "UCO Bank",
        "Karnataka Bank",
        "South Indian Bank",
        "Bandhan Bank",
        "AU Small Finance",
        "Tamilnad Mercantile",
        "Jammu & Kashmir Bank",
        "Bajaj Finserv",
      ];

      // Render
      const lg = document.getElementById("loanGrid");
      LOANS.forEach((l) => {
        const c = document.createElement("div");
        c.className = "loan-card";
        c.innerHTML = `<div class="loan-icon">${l.icon}</div><h3>${l.title}</h3><p>${l.desc}</p><div class="rate">Starting at ${l.rate}</div>`;
        c.onclick = () => openModal(l);
        lg.appendChild(c);
      });

      const bg = document.getElementById("bankGrid");
      BANKS.forEach((b) => {
        const d = document.createElement("div");
        d.className = "bank";
        d.textContent = b;
        bg.appendChild(d);
      });

      // Modal
      function openModal(loan) {
        document.getElementById("modalTitle").textContent =
          "Apply for " + loan.title;
        document.getElementById("loanType").value = loan.title;
        document.getElementById("modal").classList.add("show");
        document.body.style.overflow = "hidden";
      }
      function closeModal() {
        document.getElementById("modal").classList.remove("show");
        document.body.style.overflow = "";
        document.getElementById("loanForm").reset();
        document
          .querySelectorAll(".field")
          .forEach((f) => f.classList.remove("invalid"));
      }
      document.getElementById("modal").addEventListener("click", (e) => {
        if (e.target.id === "modal") closeModal();
      });

      // Validation
      const validators = {
        name: (v) => /^[A-Za-z\s.]{3,60}$/.test(v.trim()),
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        phone: (v) => /^[6-9]\d{9}$/.test(v.trim()),
        pan: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.trim().toUpperCase()),
        dob: (v) => {
          if (!v) return false;
          const d = new Date(v);
          const age = (Date.now() - d) / (1000 * 60 * 60 * 24 * 365.25);
          return age >= 18 && age <= 80;
        },
        amount: (v) => Number(v) >= 10000,
        income: (v) => Number(v) >= 5000,
        city: (v) => v.trim().length >= 2,
      };

      document
        .getElementById("loanForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          let ok = true;
          for (const id of Object.keys(validators)) {
            const el = document.getElementById(id);
            const field = el.closest(".field");
            if (!validators[id](el.value)) {
              field.classList.add("invalid");
              ok = false;
            } else field.classList.remove("invalid");
          }
          if (!ok) return;

          const data = {
            loanType: document.getElementById("loanType").value,
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim().toLowerCase(),
            phone: document.getElementById("phone").value.trim(),
            pan: document.getElementById("pan").value.trim().toUpperCase(),
            dob: document.getElementById("dob").value,
            amount: Number(document.getElementById("amount").value),
            income: Number(document.getElementById("income").value),
            city: document.getElementById("city").value.trim(),
            notes: document.getElementById("notes").value.trim(),
          };

          const btn = document.getElementById("submitBtn");
          btn.disabled = true;
          btn.textContent = "Submitting...";
          try {
            const res = await fetch(`${API_BASE}/customers`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            const j = await res.json();
            if (!res.ok) throw new Error(j.message || "Submission failed");
            showToast(
              "Application submitted successfully! Our team will contact you shortly.",
            );
            closeModal();
          } catch (err) {
            showToast(err.message || "Something went wrong", true);
          } finally {
            btn.disabled = false;
            btn.textContent = "Submit Application";
          }
        });

      function showToast(msg, isErr = false) {
        const t = document.getElementById("toast");
        t.textContent = msg;
        t.classList.toggle("err", isErr);
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 4000);
      }
    