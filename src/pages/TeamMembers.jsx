import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { pushActivity } from "../store/dashboardSlice";
import { FiSearch, FiFilter, FiMail, FiPhone } from "react-icons/fi";

const TeamMembers = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Sample team data
  const allMembers = [
    { id: 1, name: "Sarah Johnson", role: "Product Lead", email: "sarah@company.com", phone: "+1 (555) 123-4567", status: "online", avatar: "SJ", joinDate: "Jan 2023" },
    { id: 2, name: "Alex Chen", role: "Engineering Manager", email: "alex@company.com", phone: "+1 (555) 234-5678", status: "online", avatar: "AC", joinDate: "Mar 2023" },
    { id: 3, name: "Emma Davis", role: "UX Designer", email: "emma@company.com", phone: "+1 (555) 345-6789", status: "online", avatar: "ED", joinDate: "May 2023" },
    { id: 4, name: "Marcus Wilson", role: "Senior Developer", email: "marcus@company.com", phone: "+1 (555) 456-7890", status: "offline", avatar: "MW", joinDate: "Feb 2023" },
    { id: 5, name: "Lisa Anderson", role: "Marketing Manager", email: "lisa@company.com", phone: "+1 (555) 567-8901", status: "online", avatar: "LA", joinDate: "Apr 2023" },
    { id: 6, name: "James Brown", role: "DevOps Engineer", email: "james@company.com", phone: "+1 (555) 678-9012", status: "online", avatar: "JB", joinDate: "Jun 2023" },
    { id: 7, name: "Sophia Lee", role: "Product Designer", email: "sophia@company.com", phone: "+1 (555) 789-0123", status: "offline", avatar: "SL", joinDate: "Jul 2023" },
    { id: 8, name: "David Taylor", role: "Backend Developer", email: "david@company.com", phone: "+1 (555) 890-1234", status: "online", avatar: "DT", joinDate: "Aug 2023" },
  ];

  const filteredMembers = useMemo(() => {
    let result = allMembers;

    if (searchTerm) {
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      result = result.filter((member) => member.role.toLowerCase().includes(filterRole.toLowerCase()));
    }

    return result;
  }, [searchTerm, filterRole]);

  const onlineCount = allMembers.filter((m) => m.status === "online").length;
  const roles = [...new Set(allMembers.map((m) => m.role))];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
        <span className="chart-icon">👥</span> Team Members
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
        Manage and monitor your team members
      </p>

      {/* Stats Cards */}
      <div className="metrics-grid" style={{ marginBottom: 28 }}>
        <div className="metric-card fade-in-up">
          <div className="metric-header">
            <div className="metric-icon blue">👥</div>
          </div>
          <div className="metric-value">{allMembers.length}</div>
          <div className="metric-label">Total Members</div>
        </div>

        <div className="metric-card fade-in-up">
          <div className="metric-header">
            <div className="metric-icon green">🟢</div>
          </div>
          <div className="metric-value">{onlineCount}</div>
          <div className="metric-label">Online Now</div>
        </div>

        <div className="metric-card fade-in-up">
          <div className="metric-header">
            <div className="metric-icon yellow">⚡</div>
          </div>
          <div className="metric-value">{allMembers.length - onlineCount}</div>
          <div className="metric-label">Offline</div>
        </div>

        <div className="metric-card fade-in-up">
          <div className="metric-header">
            <div className="metric-icon purple">🎯</div>
          </div>
          <div className="metric-value">{roles.length}</div>
          <div className="metric-label">Roles</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section" style={{ marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 280, display: "flex", alignItems: "center", gap: 10 }}>
          <FiSearch size={18} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={`filter-btn ${filterRole === "all" ? "active" : ""}`}
            onClick={() => setFilterRole("all")}
          >
            <FiFilter size={14} /> All Roles
          </button>
          {roles.slice(0, 3).map((role) => (
            <button
              key={role}
              className={`filter-btn ${filterRole === role ? "active" : ""}`}
              onClick={() => setFilterRole(filterRole === role ? "all" : role)}
              title={role}
            >
              {role.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="team-grid">
        {filteredMembers.map((member) => (
          <div key={member.id} className="team-member-card">
            <div className="team-member-card" style={{ cursor: "pointer" }}>
              <div className="member-avatar">{member.avatar}</div>
              <div className="member-name">{member.name}</div>
              <div className="member-role">{member.role}</div>
              <div className="member-status">{member.joinDate}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                <a
                  href={`mailto:${member.email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "var(--accent-light)",
                    textDecoration: "none",
                    opacity: 0.8,
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                >
                  <FiMail size={14} /> Email
                </a>
                <a
                  href={`tel:${member.phone}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "var(--accent-light)",
                    textDecoration: "none",
                    opacity: 0.8,
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                >
                  <FiPhone size={14} /> Call
                </a>
              </div>

              <div style={{ marginTop: 16 }}>
                <span className={`member-badge ${member.status}`}>
                  {member.status === "online" ? "🟢" : "⚫"} {member.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No team members found</p>
          <p style={{ fontSize: 13 }}>{searchTerm ? "Try a different search term" : "Add team members to get started"}</p>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
