import classNames from "classnames";
import { useRouter } from "next/router";

interface ScheduleProps {
  schedule: any;
  checked: boolean;
}
const ScheduleCard: React.FC<ScheduleProps> = ({ checked, schedule }) => {
  const { locale } = useRouter();
  return (<div
    className={classNames(
      "relative p-4 rounded border cursor-pointer group hover:border-accent",
      {
        "border-accent shadow-sm": checked,
        "bg-gray-100 border-transparent": !checked,
      }
    )}
  >
    <span className="text-sm text-heading font-semibold block mb-2">
      {locale ==="en" ? schedule.title : schedule.title_ru}
    </span>
    <span className="text-sm text-heading block">{locale ==="en" ? schedule.description : schedule.description_ru}</span>
  </div>)
};

export default ScheduleCard;
