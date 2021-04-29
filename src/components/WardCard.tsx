import useWardStore, { getSelectedWard } from "@src/stores/ward.store";
import { Badge } from "./Badge";
import css from "./WardCard.module.css";

export const WardCard: React.FC = () => {
  const ward = useWardStore(getSelectedWard);

  if (!ward) {
    return null;
  }

  const pincodes = ward.pin_code.filter(code => !!code);
  return (
    <div className={css.root}>
      <header className={css.header}>
        <Badge className={css.badge}>#{ward.ward_no}</Badge>
        <span className={css.title}>{ward.ward_name}</span>
        {pincodes.length > 0 && (
          <Badge className={css.pinBadge}>
            <b>Pin: </b>
            <span className={css.pin}>{pincodes.join(", ")}</span>
          </Badge>
        )}
      </header>
      <main className={css.content}>
        {ward.telegram_group && (
          <a href={ward.telegram_group}>{ward.telegram_group}</a>
        )}
        {!ward.telegram_group && (
          <div className={css.emptyPlaceholder}>No chat group link found</div>
        )}
      </main>
    </div>
  );
};
