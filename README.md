# ⚡ Apex Today
**The ultimate daily companion for technical support efficiency.**

"Apex Today" is a premium, high-performance operational dashboard designed to streamline the daily workflow of technical support agents. It provides a centralized, visually rich environment for operators to manage routines, access critical data, and navigate complex diagnostic tools with speed and precision.

## ✨ Key Features

### 📋 Smart Data Management
- **Instant Clipboard**: One-click copying for frequently used data like CUIT and Domicilio, with visual confirmation.
- **Advanced MAC Formatter**: specialized input system that auto-segments 12-character strings into standard MAC format.
- **Visual Feedback**: Real-time "COPIED" overlay animations on individual data segments ensure confidence in every action.
- **Persistence**: All data entered is locally persisted, ensuring your workspace is ready exactly how you left it.

### 🚀 Efficiency & Navigation
- **Floating Shortcut Dock**: A customizable, unobtrusive side-dock for quick access to internal scripts (Apex Scripting) and external tools (KnowB2B).
- **Custom Integration**: Add your own URL shortcuts with automatic icon fetching and categorization.
- **Smart Layouts**: Responsive positioning allows shortcuts to adapt to your screen real estate, stacking cleanly on mobile or desktop.

### 🛠️ Operational Tools
- **Daily Checklist**: A persistent interactive list to track mandatory daily tasks and operational verifications.
- **Configurable Workspace**: Toggle visibility of modules (Clock, Tasks, Shortcuts) to focus on what matters.
- **Time Management**: Integrated clock and calendar widgets to keep track of SLAs and shifts.

### 🖼️ Premium Visual Experience
- **Glassmorphism Design**: A state-of-the-art interface using translucent materials, blurs, and curated color palettes in both Light and Dark variants.
- **Fluid Animations**: Smooth entry/exit transitions and hover effects that make the interface feel alive and premium.
- **Adaptive Theme**: Seamlessly switches between dark and light modes to match your system preference.

## 🛠️ Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Core**: React & TypeScript
- **Styling**: Tailwind CSS (v4 Alpha) & PostCSS
- **Icons**: Lucide React
- **State**: LocalStorage & React Hooks

## 📂 Project Structure
```text
app/
  ├── components/
  │   ├── InfoForm.tsx       # Smart inputs & MAC logic
  │   ├── ShortcutFloater.tsx # Floating dock & modal logic
  │   ├── DailyTasks.tsx     # Checklist module
  │   └── ConfigModal.tsx    # User preferences
  ├── data/
  │   └── i18n.ts           # Dictionary & localization
  └── page.tsx              # Main entry point
```

## 🧩 Recommended Extensions
To get the full experience and stay in the flow, I recommend this Chrome extension:

- **New Tab Redirect**
  - **Why?** Makes **Apex Today** your default new tab page, ensuring your tasks, top notes, and operational tools are always the first thing you see — along with your shortcuts!

## 📄 License
This project is designed for internal technical support operations and is shared as a reference for premium dashboard standards.

---
Made with 💛 by [Gonza](https://github.com/gonzalogramagia)
