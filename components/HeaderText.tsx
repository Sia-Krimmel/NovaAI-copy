import { H4, H5, P } from './typography';

interface HeaderProps {
  title?: string;
  description?: string;
}

//TO DO: edit styles in parent, not in here
export default function HeaderText({ title, description }: HeaderProps) {
  return (
    <div style={{ paddingTop: '0.4rem', paddingBottom: '1rem' }}>
      {title && <H4 style={{ color: 'var(--theme-color-text)', paddingBottom: '1rem', fontSize: '24px' }}>{title}</H4>}
      {description && <P dangerouslySetInnerHTML={{ __html: description }} style={{ color: 'var(--theme-color-form-text)' }} />}
    </div>
  );
}
