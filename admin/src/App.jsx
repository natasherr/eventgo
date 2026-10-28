import { useState } from 'react';
import './App.css';

function App() {
const [activePage, setActivePage] = useState('Dashboard');

const menuItems = [
{ name: 'Dashboard', icon: '▦' },
{ name: 'Events', icon: '◷' },
{ name: 'Tickets & Sales', icon: '▤' },
{ name: 'Reports', icon: '▥' },
{ name: 'Security', icon: '♧' },
];

const stats = [
{ title: 'Total Events', value: '24', change: '+12%', icon: '◷' },
{ title: 'Tickets Sold', value: '1,284', change: '+18%', icon: '▤' },
{ title: 'Total Revenue', value: 'KES 486,500', change: '+8%', icon: '↗' },
{ title: 'Upcoming Events', value: '08', change: 'Next 30 days', icon: '▦' },
];

return ( <div className="app-layout"> <aside className="sidebar"> <div className="brand"> <div className="brand-icon">E</div> <div> <h2>EventGo</h2> <span>ADMINISTRATION</span> </div> </div>

    <div className="menu-label">MAIN MENU</div>

    <nav className="sidebar-nav">
      {menuItems.map((item) => (
        <button
          key={item.name}
          className={`nav-item ${activePage === item.name ? 'active' : ''}`}
          onClick={() => setActivePage(item.name)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.name}
          {item.name === 'Events' && (
            <span className="menu-count">24</span>
          )}
        </button>
      ))}
    </nav>

    <div className="sidebar-bottom">
      <div className="help-card">
        <div className="help-icon">?</div>
        <h4>Need help?</h4>
        <p>Check the admin guide for assistance.</p>
        <button onClick={() => setActivePage('Help')}>
          View guide ↗
        </button>
      </div>

      <div className="profile">
        <div className="avatar">A</div>
        <div className="profile-info">
          <strong>Admin User</strong>
          <span>Administrator</span>
        </div>
        <button className="profile-menu" aria-label="Profile options">
          •••
        </button>
      </div>
    </div>
  </aside>

  <main className="main-content">
    <header className="topbar">
      <div className="breadcrumb">
        <span>EventGo</span>
        <span className="breadcrumb-divider">/</span>
        <strong>{activePage}</strong>
      </div>

      <div className="topbar-actions">
        <span className="system-status">
          <span className="status-dot"></span>
          System online
        </span>
        <button className="icon-button" aria-label="Notifications">
          ♧
        </button>
        <div className="top-avatar">A</div>
      </div>
    </header>

    <section className="page-content">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>{activePage === 'Dashboard' ? 'Dashboard' : activePage}</h1>
          <p className="page-description">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setActivePage('Events')}
        >
          <span>＋</span> Manage Events
        </button>
      </div>

      {activePage === 'Dashboard' ? (
        <>
          <div className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.title}>
                <div className="stat-top">
                  <span className="stat-title">{stat.title}</span>
                  <span className="stat-icon">{stat.icon}</span>
                </div>
                <h2>{stat.value}</h2>
                <div className="stat-footer">
                  <span className="stat-change">{stat.change}</span>
                  {stat.title !== 'Upcoming Events' && (
                    <span className="stat-period">vs. last month</span>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="content-grid">
            <section className="panel sales-panel">
              <div className="panel-heading">
                <div>
                  <h3>Sales Overview</h3>
                  <p>Revenue performance over the last 7 months</p>
                </div>
                <select aria-label="Sales period" defaultValue="7 months">
                  <option>7 months</option>
                  <option>30 days</option>
                  <option>12 months</option>
                </select>
              </div>

              <div className="chart">
                {[45, 65, 52, 78, 60, 88, 72].map((height, index) => (
                  <div className="chart-column" key={index}>
                    <div
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span>
                      {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h3>Recent Activity</h3>
                  <p>Latest updates from your platform</p>
                </div>
              </div>

              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">✓</span>
                  <div>
                    <strong>New ticket purchased</strong>
                    <p>Tickets were purchased for Nairobi Tech Summit.</p>
                    <small>5 minutes ago</small>
                  </div>
                </div>

                <div className="activity-item">
                  <span className="activity-icon">＋</span>
                  <div>
                    <strong>Event created</strong>
                    <p>New event added to the platform.</p>
                    <small>30 minutes ago</small>
                  </div>
                </div>

                <div className="activity-item">
                  <span className="activity-icon">↗</span>
                  <div>
                    <strong>Sales update</strong>
                    <p>Your ticket sales dashboard has been updated.</p>
                    <small>1 hour ago</small>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="panel upcoming-panel">
            <div className="panel-heading">
              <div>
                <h3>Upcoming Events</h3>
                <p>Keep track of your scheduled events</p>
              </div>
              <button
                className="text-button"
                onClick={() => setActivePage('Events')}
              >
                View all events →
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Tickets Sold</th>
                    <th>Revenue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nairobi Tech Summit</td>
                    <td>15 Nov 2026</td>
                    <td>320</td>
                    <td>KES 160,000</td>
                    <td><span className="badge published">Published</span></td>
                  </tr>
                  <tr>
                    <td>Creative Arts Festival</td>
                    <td>22 Nov 2026</td>
                    <td>185</td>
                    <td>KES 92,500</td>
                    <td><span className="badge published">Published</span></td>
                  </tr>
                  <tr>
                    <td>Business Innovation Forum</td>
                    <td>05 Dec 2026</td>
                    <td>96</td>
                    <td>KES 48,000</td>
                    <td><span className="badge draft">Draft</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section className="panel placeholder-panel">
          <div className="placeholder-icon">▦</div>
          <h3>{activePage}</h3>
          <p>
            The {activePage.toLowerCase()} section will be implemented here.
          </p>
          {activePage === 'Events' && (
            <button className="primary-button">
              ＋ Add New Event
            </button>
          )}
        </section>
      )}
    </section>

    <footer className="page-footer">
      <span>© 2026 EventGo Admin</span>
      <span>Event Ticketing &amp; Reservation System</span>
    </footer>
  </main>
</div>


);
}

export default App;
