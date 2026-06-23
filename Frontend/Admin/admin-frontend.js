      // const API_BASE = "http://localhost:5000/api";
      const API_BASE = "https://loansetu-soqg.onrender.com/api";
      const TOKEN_KEY = "loansetu_admin_token";

      function token() {
        return localStorage.getItem(TOKEN_KEY);
      }
      function authHeaders() {
        return {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token(),
        };
      }

      // Toggle UI
      function showDash() {
        document.getElementById("loginWrap").classList.add("hide");
        document.getElementById("dash").classList.add("show");
        loadCustomers();
      }
      function showLogin() {
        document.getElementById("loginWrap").classList.remove("hide");
        document.getElementById("dash").classList.remove("show");
      }

      if (token()) showDash();
      else showLogin();

      // Login
      document
        .getElementById("loginForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const btn = document.getElementById("loginBtn"),
            err = document.getElementById("loginErr");
          err.style.display = "none";
          btn.disabled = true;
          btn.textContent = "Signing in...";
          try {
            const res = await fetch(`${API_BASE}/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" , credentials: "include"},
              body: JSON.stringify({
                username: username.value.trim(),
                password: password.value,
              }),
            });
            const j = await res.json();
            if (!res.ok) throw new Error(j.message || "Login failed");
            localStorage.setItem(TOKEN_KEY, j.token);
            document.getElementById("who").textContent =
              "Hi, " + (j.username || "admin");
            showDash();
          } catch (ex) {
            err.textContent = ex.message;
            err.style.display = "block";
          } finally {
            btn.disabled = false;
            btn.textContent = "Sign In";
          }
        });

      function logout() {
        localStorage.removeItem(TOKEN_KEY);
        location.reload();
      }

      // Filters
      let _t;
      ["fName", "fDate", "fStatus"].forEach((id) => {
        document.getElementById(id).addEventListener("input", () => {
          clearTimeout(_t);
          _t = setTimeout(loadCustomers, 300);
        });
      });
      function clearFilters() {
        fName.value = "";
        fDate.value = "";
        fStatus.value = "";
        loadCustomers();
      }

      async function loadCustomers() {
        const params = new URLSearchParams();
        if (fName.value.trim()) params.set("name", fName.value.trim());
        if (fDate.value) params.set("date", fDate.value);
        if (fStatus.value) params.set("status", fStatus.value);
        try {
          const res = await fetch(
            `${API_BASE}/customers?` + params.toString(),
            { headers: authHeaders() },
          );
          if (res.status === 401) {
            logout();
            return;
          }
          const data = await res.json();
          renderCustomers(data);
          renderStats(data);
        } catch (e) {
          toast("Failed to load customers", true);
        }
      }

      function renderStats(rows) {
        const total = rows.length;
        const pending = rows.filter((r) => r.status === "Pending").length;
        const approved = rows.filter((r) => r.status === "Approved").length;
        const rejected = rows.filter((r) => r.status === "Rejected").length;
        document.getElementById("stats").innerHTML = `
    <div class="stat-card"><b>${total}</b><span>Total Applications</span></div>
    <div class="stat-card"><b>${pending}</b><span>Pending</span></div>
    <div class="stat-card"><b>${approved}</b><span>Approved</span></div>
    <div class="stat-card"><b>${rejected}</b><span>Rejected</span></div>`;
      }

      function renderCustomers(rows) {
        const tb = document.getElementById("tbody");
        document.getElementById("empty").style.display = rows.length
          ? "none"
          : "block";
        tb.innerHTML = rows
          .map(
            (r) => `
    <tr>
      <td><b>${esc(r.name)}</b><br><small style="color:#64748b">${esc(r.email)}</small></td>
      <td>${esc(r.loanType)}</td>
      <td>₹${Number(r.amount).toLocaleString("en-IN")}</td>
      <td>${esc(r.phone)}</td>
      <td>${esc(r.city)}</td>
      <td>${new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
      <td><span class="badge ${r.status.toLowerCase()}">${r.status}</span></td>
      <td class="actions">
        <button class="icon-btn btn-primary" onclick='openEdit(${JSON.stringify(r).replace(/'/g, "&#39;")})'>Edit</button>
        <button class="icon-btn btn-danger"  onclick="askDel('${r._id}','${esc(r.name)}')">Delete</button>
      </td>
    </tr>`,
          )
          .join("");
      }
      function esc(s) {
        return String(s || "").replace(
          /[&<>"']/g,
          (c) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            })[c],
        );
      }

      // Edit
      function openEdit(r) {
        eId.value = r._id;
        eName.value = r.name;
        eEmail.value = r.email;
        ePhone.value = r.phone;
        eCity.value = r.city;
        eLoan.value = r.loanType;
        eAmount.value = r.amount;
        eStatus.value = r.status;
        document.getElementById("editModal").classList.add("show");
      }
      function closeEdit() {
        document.getElementById("editModal").classList.remove("show");
      }
      async function saveEdit() {
        const body = {
          name: eName.value.trim(),
          email: eEmail.value.trim(),
          phone: ePhone.value.trim(),
          city: eCity.value.trim(),
          loanType: eLoan.value.trim(),
          amount: Number(eAmount.value),
          status: eStatus.value,
        };
        try {
          const res = await fetch(`${API_BASE}/customers/${eId.value}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(body),
          });
          const j = await res.json();
          if (!res.ok) throw new Error(j.message || "Update failed");
          toast("Customer updated");
          closeEdit();
          loadCustomers();
        } catch (e) {
          toast(e.message, true);
        }
      }

      // Delete
      let _delId = null;
      function askDel(id, name) {
        _delId = id;
        delName.textContent = name;
        document.getElementById("delModal").classList.add("show");
      }
      function closeDel() {
        document.getElementById("delModal").classList.remove("show");
        _delId = null;
      }
      async function confirmDel() {
        try {
          const res = await fetch(`${API_BASE}/customers/${_delId}`, {
            method: "DELETE",
            headers: authHeaders(),
          });
          const j = await res.json();
          if (!res.ok) throw new Error(j.message || "Delete failed");
          toast("Customer deleted");
          closeDel();
          loadCustomers();
        } catch (e) {
          toast(e.message, true);
        }
      }

      function toast(msg, isErr = false) {
        const t = document.getElementById("toast");
        t.textContent = msg;
        t.classList.toggle("err", isErr);
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 3500);
      }
    