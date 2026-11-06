import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const TABS = [
  {
    to: "/",
    label: "Home",
    end: true,
    icon: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </>
    ),
  },
  {
    to: "/recipes",
    label: "Recipes",
    icon: (
      <>
        <path d="M12 7c-1.5-2-4-3-8-3v14c4 0 6.5 1 8 3" />
        <path d="M12 7c1.5-2 4-3 8-3v14c-4 0-6.5 1-8 3z" />
        <path d="M12 7v14" />
      </>
    ),
  },
  {
    to: "/search",
    label: "Search",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-5-5" />
      </>
    ),
  },
  {
    to: "/add",
    label: "Add",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </>
    ),
  },
  {
    to: "/manage",
    label: "Manage",
    icon: (
      <>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </>
    ),
  },
];

function TabBar() {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const isField = (el) =>
      el && ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
    const onIn = (e) => isField(e.target) && setTyping(true);
    const onOut = () => setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <nav className={typing ? "tab_bar tab_bar_hidden" : "tab_bar"} aria-label="Main">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {tab.icon}
          </svg>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default TabBar;
