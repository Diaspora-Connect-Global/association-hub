import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "@/lib/translations";
import { useIdleSession } from "@/hooks/useIdleSession";

/**
 * Mounted once inside the signed-in routes. Silent while the admin is active; in the last
 * minute before an inactivity sign-out it shows a short countdown with "Stay signed in".
 */
export function IdleSessionDialog() {
  const { settings } = useSettings();
  const t = useTranslation(settings.language);
  const { secondsLeft, stay } = useIdleSession();
  const n = secondsLeft ?? 0;

  return (
    <AlertDialog open={secondsLeft !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.idleTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {(n === 1 ? t.idleBodyOne : t.idleBodyOther).replace("{{count}}", String(n))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={stay} autoFocus>
            {t.idleStay}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
