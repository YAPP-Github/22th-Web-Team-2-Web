'use client';
import useMyInfo from '@/api/mypage/useMyInfo';
import useUpdateShelterAlarm from '@/api/mypage/useUpdateShelterAlarm';
import useUpdateVolInfo from '@/api/mypage/useUpdateVolInfo';
import { SettingProps, isShelterInfo } from '@/app/admin/page';
import { ArrowRightLg } from '@/asset/icons';
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch';
import { Body1, Caption3 } from '@/components/common/Typography';
import useToast from '@/hooks/useToast';
import Link from 'next/link';
import { useCallback } from 'react';
import * as styles from './SettingItem.css';

interface SettingItemProps {
  setting: SettingProps;
  index: number;
  isShelterRole: boolean;
  notification: React.ReactNode[];
  dangle_role: string;
}

export default function SettingItem({
  setting,
  index,
  isShelterRole,
  notification,
  dangle_role
}: SettingItemProps) {
  const { data: info } = useMyInfo(dangle_role, {
    enabled: !!dangle_role && dangle_role !== 'NONE'
  });
  const { mutateAsync: volunteerAlarm } = useUpdateVolInfo();
  const { mutateAsync: shelterAlarm } = useUpdateShelterAlarm();

  const toastOn = useToast();

  const handleToggleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let payload;

      //FIXME: 보호소 alarm 추가되어야 함
      if (!isShelterInfo(info)) {
        payload = {
          nickName: !isShelterInfo(info) ? info?.nickName! : '',
          phoneNumber: !isShelterInfo(info) ? info?.phoneNumber! : '',
          alarmEnabled: e.target.checked
        };

        volunteerAlarm(payload).then(res => {
          toastOn('카카오톡 알림 설정이 업로드 되었습니다.');
        });
      } else {
        payload = {
          alarmEnabled: e.target.checked
        };

        shelterAlarm(payload).then(res => {
          toastOn('카카오톡 알림 설정이 업로드 되었습니다.');
        });
      }
    },
    [volunteerAlarm, shelterAlarm, toastOn, info]
  );

  function KaKaoAlarm({
    setting,
    notification
  }: {
    setting: SettingProps;
    index: number;
    notification: React.ReactNode[];
  }) {
    const { label, Svg } = setting;
    return (
      <>
        <div className={styles.accountBox}>
          <div className={styles.accountTxt}>
            <Svg />
            <Body1>{label}</Body1>
          </div>
          <ToggleSwitch
            name={'alram'}
            onChange={handleToggleChange}
            checked={info?.alarmEnabled}
          />
        </div>

        <Caption3 color="gray600" className={styles.noti}>
          {notification as string[]}
        </Caption3>
        <div className={styles.divider} />
      </>
    );
  }

  function OtherAlarm({
    setting,
    index
  }: {
    setting: SettingProps;
    index: number;
  }) {
    const { link, label, Svg } = setting;
    return (
      <Link href={link}>
        <div className={styles.accountBox}>
          <div className={styles.accountTxt}>
            <Svg />
            <Body1>{label}</Body1>
          </div>
          <ArrowRightLg />
        </div>

        {index === 0 || index === 3 ? <div className={styles.divider} /> : null}
      </Link>
    );
  }

  if (index === 1 && isShelterRole) return;

  return index === 0 ? (
    <KaKaoAlarm setting={setting} index={index} notification={notification} />
  ) : (
    <OtherAlarm setting={setting} index={index} />
  );
}
