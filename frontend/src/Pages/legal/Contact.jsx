import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { LegalLayout } from '../../components/LegalLayout';
import { submitContact } from '../../api/client';
import { LEGAL } from '../../content/legalSite';
import { useLocale } from '../../hooks/useLocale';

export function Contact() {
  const { t } = useTranslation('contact');
  const { to } = useLocale();
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'support',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback({ type: '', text: '' });
    setLoading(true);
    try {
      await submitContact(form);
      setFeedback({ type: 'success', text: t('success') });
      setForm({ name: '', email: '', topic: 'support', message: '' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LegalLayout title={t('title')}>
      <p>
        <Trans
          i18nKey="intro"
          ns="contact"
          components={{ legalLink: <Link to={to('legalNotice')} /> }}
        />
      </p>

      <ul>
        <li>
          {t('topics.support')}:{' '}
          <a href={`mailto:${LEGAL.emails.support}`}>{LEGAL.emails.support}</a>
        </li>
        <li>
          {t('topics.sponsorship')}:{' '}
          <a href={`mailto:${LEGAL.emails.sponsorships}`}>{LEGAL.emails.sponsorships}</a>
        </li>
      </ul>

      <h2>{t('formTitle')}</h2>
      <p>
        <Trans
          i18nKey="formPrivacy"
          ns="contact"
          components={{ privacyLink: <Link to={to('privacy')} /> }}
        />
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          {t('name')}
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            maxLength={120}
            autoComplete="name"
          />
        </label>
        <label>
          {t('email')}
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
            maxLength={200}
            autoComplete="email"
          />
        </label>
        <label>
          {t('topic')}
          <select
            value={form.topic}
            onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
          >
            {Object.entries(t('topics', { returnObjects: true })).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('message')}
          <textarea
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            required
            minLength={10}
            maxLength={5000}
          />
        </label>
        <button type="submit" className="contact-form__submit" disabled={loading}>
          {loading ? t('sending') : t('submit')}
        </button>
      </form>

      {feedback.text && (
        <p className={`contact-message contact-message--${feedback.type}`}>{feedback.text}</p>
      )}
    </LegalLayout>
  );
}
