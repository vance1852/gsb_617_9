import type { App, Component } from "vue";

// Components
import { NButton } from "./components/Button";
import { NInput } from "./components/Input";
import { NCard } from "./components/Card";
import { NAvatar } from "./components/Avatar";
import { NTabs } from "./components/Tabs";
import { NBreadcrumb } from "./components/Breadcrumb";
import { NToast } from "./components/Toast";
import { NModal } from "./components/Modal";
import { NSkeleton } from "./components/Skeleton";
import { NTable } from "./components/Table";
import { NBadge } from "./components/Badge";

export {
  NButton,
  NInput,
  NCard,
  NAvatar,
  NTabs,
  NBreadcrumb,
  NToast,
  NModal,
  NSkeleton,
  NTable,
  NBadge,
};

// Types
export * from "./types";

// Styles
import "./styles/index.css";

// Plugin
const components: Record<string, Component> = {
  NButton,
  NInput,
  NCard,
  NAvatar,
  NTabs,
  NBreadcrumb,
  NToast,
  NModal,
  NSkeleton,
  NTable,
  NBadge,
};

export default {
  install(app: App) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};
