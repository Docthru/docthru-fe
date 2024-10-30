import { useForm, FormProvider } from 'react-hook-form';
import TextArea from '../common/form/TextArea';
import styles from './FeedbackForm.module.css';
import { useCreateFeedback } from '@/service/mutations/work';
import Svg from '../common/Svg';
import { FEEDBACK } from '@/variables/formValidation';

export default function FeedbackForm({ id }) {
  const formMethods = useForm();
  const s = styles;

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = formMethods;

  const { mutate } = useCreateFeedback(id);

  const handleFeedbackSubmit = (data) => {
    mutate(data);
    reset();
  };

  return (
    <FormProvider {...formMethods}>
      <form
        className={s.FeedbackForm}
        onSubmit={handleSubmit(handleFeedbackSubmit)}
      >
        <TextArea
          name="content"
          placeholder="피드백을 남겨주세요"
          className={s.textarea}
          validations={FEEDBACK.CONTENT}
        />
        <button className={s.submitButton} type="submit" disabled={!isValid}>
          <Svg
            addName="arrowDown"
            name="circle"
            className="arrowCircle"
            width="40"
          />
        </button>
      </form>
    </FormProvider>
  );
}
