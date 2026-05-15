import { useI18n } from "@/lib/i18n";

interface Props {
  theme: "light" | "dark";
  onToggle: () => void;
}

export function ThemeSwitch({ theme, onToggle }: Props) {
  const { t } = useI18n();
  const isDark = theme === "dark";

  return (
    <label
      aria-label={t("header.theme.toggle", "Toggle theme")}
      className="relative inline-flex h-[26px] w-[52px] cursor-pointer items-center"
    >
      <input
        type="checkbox"
        checked={isDark}
        onChange={onToggle}
        className="peer sr-only"
      />
      <span className="absolute inset-0 rounded-full bg-[#28292c] transition-colors peer-checked:bg-[#d8dbe0]" />
      <span
        className={`absolute left-[5px] top-[5px] h-4 w-4 rounded-full transition-all ${
          isDark
            ? "translate-x-[26px] bg-[#28292c] shadow-none"
            : "translate-x-0 bg-[#28292c] shadow-[inset_7px_-2px_0_0_#d8dbe0]"
        }`}
      />
    </label>
  );
}
