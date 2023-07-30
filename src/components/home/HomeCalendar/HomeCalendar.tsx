'use client';
import CheckBox from '@/components/common/CheckBox/CheckBox.tsx';
import * as styles from './HomeCalendar.css.ts';
import DangleCalendar from '@/components/common/Calendar/DangleCalendar';
import { useState } from 'react';
import { Caption3, H4 } from '@/components/common/Typography/index.ts';
import { ArrowFold, ArrowUnfold } from '@/asset/icons/index.ts';
import useBooleanState from '@/hooks/useBooleanState.tsx';
import moment from 'moment';
import clsx from 'clsx';

interface FoldToggleProps {
  isFolded: boolean;
  onClick: () => void;
  className?: string;
}
const FoldToggle: React.FC<FoldToggleProps> = ({
  isFolded,
  onClick,
  className
}) => {
  return (
    <div className={clsx(styles.toggleItem, className)} onClick={onClick}>
      <Caption3 color="gray600">달력 {isFolded ? '펼치기' : '접기'}</Caption3>
      {isFolded ? <ArrowFold /> : <ArrowUnfold />}
    </div>
  );
};

interface HomeCalendarProps {}
const HomeCalendar: React.FC<HomeCalendarProps> = ({}) => {
  const [bookmark, setBookmark] = useState(false);
  const [isFolded, fold, unfold] = useBooleanState(false);

  return (
    <div>
      {(isFolded && (
        <div className={styles.foldedHeader}>
          <H4>{moment(new Date()).format('YYYY.MM')}</H4>
          <FoldToggle
            className={styles.headerFoldToggle}
            isFolded={true}
            onClick={unfold}
          />
        </div>
      )) || (
        <div>
          <DangleCalendar id="home-calendar" />
          <div className={styles.calendarFooter}>
            <div
              className={styles.toggleItem}
              onClick={() => setBookmark(!bookmark)}
            >
              <CheckBox value={bookmark} onClick={() => null} />
              <Caption3>즐겨찾기한 보호소만 보기</Caption3>
            </div>
            <FoldToggle isFolded={false} onClick={fold} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeCalendar;
