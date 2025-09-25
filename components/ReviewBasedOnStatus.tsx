import { AirtableReviewStatusEnum } from '@root/common/types';
import Button, { ButtonStyleEnum } from './Button';
import FormMessageWithIcon from './FormMessageWithIcon';
import LightningAnimation from '@root/components/animations/LightningAnimation';
import SuccessCheckAnimation from '@root/components/animations/SuccessCheckAnimation';

export function ReviewModal({ status, reviewMessage, successMessage }) {
  return (
    <div>
      <FormMessageWithIcon
        icon={status !== AirtableReviewStatusEnum.AUDITED ? <LightningAnimation /> : <SuccessCheckAnimation />}
        message={status !== AirtableReviewStatusEnum.AUDITED ? reviewMessage : successMessage}
      >
        {status !== AirtableReviewStatusEnum.AUDITED ? (
          <Button withArrow={true}>View Submission</Button>
        ) : (
          <Button href="/evp-process" withArrow={true} style={ButtonStyleEnum.GREEN}>
            Back to Dashboard
          </Button>
        )}
      </FormMessageWithIcon>
    </div>
  );
}
