import useVolunteerEvent from '@/api/shelter/event/useVolunteerEvent';
import { Calendar, Clockmd } from '@/asset/icons';
import Badge from '@/components/common/Badge/Badge';
import Button from '@/components/common/Button/Button';
import LoadingIndicator from '@/components/common/Button/LoadingIndicator';
import FixedFooter from '@/components/common/FixedFooter/FixedFooter';
import Modal from '@/components/common/Modal/Modal';
import Profile from '@/components/common/Profile/Profile';
import { Body1, Body2, Body3, H4 } from '@/components/common/Typography';
import useBooleanState from '@/hooks/useBooleanState';
import { useAuthContext } from '@/providers/AuthContext';
import { palette } from '@/styles/color';
import {
  formatKoDate,
  getDuration,
  isDatePast,
  pmamConvert
} from '@/utils/timeConvert';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';
import ConfirmContent from './ConfirmContent/ConfirmContent';
import * as styles from './ShelterEvent.css';
import {
  AGE_LIMIT,
  VOLUNTEER_EVENT_CATEGORY
} from '@/constants/volunteerEvent';
import useToast from '@/hooks/useToast';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { COOKIE_REDIRECT_URL } from '@/constants/cookieKeys';

const QNA =
  'https://www.notion.so/yapp-workspace/FAQ-f492ba54a5d647129ca9697fbd307b20?pvs=4';
const NOTICE = '*세부 주소는 봉사 참가자에게 별도로 안내드립니다.';
const DangleMap = dynamic(() => import('@/components/common/Map/DangleMap'), {
  loading: () => <LoadingIndicator color="primary" />
});

export default function ShelterEvent() {
  const route = useRouter();
  const pathname = usePathname();
  const splittedPath = pathname.split('/');
  const shelterId = Number(splittedPath[2]);
  const volunteerEventId = Number(splittedPath[4]);

  const { dangle_access_token, dangle_role, dangle_id } = useAuthContext();
  const [isModal, setModalOpen, setModalClose] = useBooleanState();
  const [showVol, setShowVolOpen, setShowVolClose, setToggleShowVol] =
    useBooleanState();
  const toastOn = useToast();

  const { data: eventDetail } = useVolunteerEvent(shelterId, volunteerEventId);

  if (!eventDetail) return <LoadingIndicator color="primary" />;

  const {
    shelterName,
    shelterProfileImageUrl,
    title,
    recruitNum,
    address,
    description,
    ageLimit,
    category,
    eventStatus,
    myParticipationStatus,
    startAt,
    endAt,
    joiningVolunteers,
    waitingVolunteers
  } = eventDetail;

  const allVolunteers = joiningVolunteers.concat(waitingVolunteers);

  const handleModalOpen = () => {
    if (!dangle_access_token) {
      // access_token 없을 시에 개인 로그인 페이지로 보내서 리다이렉트 처리
      toastOn('봉사에 참여하기 위해 로그인이 필요합니다.');
      Cookies.set(COOKIE_REDIRECT_URL, window.location.pathname);
      return route.push(
        `/volunteer/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`
      );
    } else if (dangle_role === 'SHELTER') {
      // Shelter 계정은 신청 불가능, 팝업
      return toastOn('보호소 파트너 계정으로는 이벤트에 참여할 수 없어요.');
    } else {
      setModalOpen();
    }
  };

  const renderTextWithLineBreaks = (description: string) => {
    const lines = description.split('\n');

    return (
      <>
        {lines.map((line, index) => (
          <Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </Fragment>
        ))}
      </>
    );
  };

  const renderFooterButton = () => {
    if (eventStatus === 'CLOSED') {
      return <Button disabled>모집이 종료된 일정입니다.</Button>;
    }

    if (dangle_role === 'SHELTER' && dangle_id === shelterId) {
      return (
        <Button
          style={{ marginTop: 1 }}
          onClick={() =>
            route.push(`/admin/shelter/event/edit?id=${volunteerEventId}`)
          }
        >
          일정 수정하기
        </Button>
      );
    }

    if (
      myParticipationStatus === 'NONE' &&
      joiningVolunteers?.length < recruitNum
    ) {
      return <Button onClick={handleModalOpen}>봉사 신청하기</Button>;
    }

    if (
      myParticipationStatus === 'JOINING' &&
      joiningVolunteers?.length < recruitNum
    ) {
      return (
        <Button variant="line" onClick={handleModalOpen}>
          봉사 신청 취소하기
        </Button>
      );
    }

    if (
      myParticipationStatus === 'NONE' &&
      joiningVolunteers?.length >= recruitNum
    ) {
      return (
        <Button buttonColor="secondary" onClick={handleModalOpen}>
          봉사 대기 신청하기
        </Button>
      );
    }

    if (myParticipationStatus === 'WAITING') {
      return (
        <Button
          buttonColor="secondary"
          variant="line"
          onClick={handleModalOpen}
        >
          봉사 대기 취소하기
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <div className={styles.eventHeader}>
        <div className={styles.container}>
          <div className={styles.badgeWrapper}>
            {isDatePast(startAt) ? (
              <Badge type="gray">모집완료</Badge>
            ) : (
              <Badge type="primary">모집중</Badge>
            )}

            <Badge type="line">{`#${VOLUNTEER_EVENT_CATEGORY[category]}`}</Badge>
          </div>

          <p className={styles.title}>{title}</p>

          <div className={styles.infoContainer}>
            <div className={styles.infoWrapper}>
              <Calendar />
              <Body2 color="gray900">{formatKoDate(startAt)}</Body2>
            </div>
            <div className={styles.infoWrapper}>
              <Clockmd />
              <Body2 color="gray900">
                {pmamConvert(startAt)}
                &nbsp;-&nbsp;
                {pmamConvert(endAt)}
                &nbsp;(
                {getDuration(startAt, endAt)})
              </Body2>
            </div>
          </div>

          <div className={styles.profileWraper}>
            <Image
              width={32}
              height={32}
              className={styles.profileImage}
              src={shelterProfileImageUrl || '/images/DefaultAnimal.png'}
              alt={`${shelterName}-profile-image`}
            />
            <Body3>{shelterName}</Body3>
          </div>

          <div
            className={styles.divider}
            style={assignInlineVars({
              [styles.dividerHeghit]: '8px'
            })}
          />
          <div className={styles.textWrapper}>
            <H4>
              참여중인 인원{' '}
              <span style={{ color: palette.error }}>
                {joiningVolunteers?.length}
              </span>
              /{recruitNum}
            </H4>

            {allVolunteers?.map((people: string, index) => {
              if (index >= 5 && !showVol) {
                return null;
              }

              return (
                <Profile
                  key={index}
                  name={people}
                  waiting={index + 1 <= recruitNum ? false : true}
                />
              );
            })}

            {allVolunteers.length > 5 && (
              <Button
                size="xsmall"
                buttonColor="secondary"
                variant="line"
                onClick={setToggleShowVol}
              >
                {showVol ? '참여 인원 접기' : '참여 인원 더보기'}
              </Button>
            )}
          </div>
          <div
            className={styles.divider}
            style={assignInlineVars({
              [styles.dividerHeghit]: '1px'
            })}
          />

          <div className={styles.textWrapper}>
            <H4>봉사 소개</H4>

            <Body1>{renderTextWithLineBreaks(description)}</Body1>
          </div>

          <div
            className={styles.divider}
            style={assignInlineVars({
              [styles.dividerHeghit]: '1px'
            })}
          />

          <div className={styles.textWrapper}>
            <H4>모집 대상</H4>
            <Body1>{AGE_LIMIT[ageLimit]}</Body1>
          </div>

          <div
            className={styles.divider}
            style={assignInlineVars({
              [styles.dividerHeghit]: '1px'
            })}
          />

          <div className={styles.textWrapper}>
            <H4>위치</H4>
            <DangleMap
              address={address.address}
              latitude={address?.latitude}
              longitude={address?.longitude}
              notice={NOTICE}
            />
          </div>

          <div
            className={styles.divider}
            style={assignInlineVars({
              [styles.dividerHeghit]: '8px'
            })}
          />

          <p className={styles.underline}>
            <Link href={QNA}>자주 묻고 답하는 질문</Link>
          </p>
          <p className={styles.underline}>1:1 문의하기</p>
        </div>
      </div>

      <FixedFooter color={palette.white}>{renderFooterButton()}</FixedFooter>

      <Modal open={isModal} onClose={setModalClose} isHeader={false}>
        <ConfirmContent
          eventDetail={eventDetail}
          shelterId={shelterId}
          volunteerEventId={volunteerEventId}
          onClose={setModalClose}
        />
      </Modal>
    </>
  );
}
