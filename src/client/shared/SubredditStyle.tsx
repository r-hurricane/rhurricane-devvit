export interface SubredditStyleProps {
  base: string;
  pin: string;
  key: string;
}

export const SubredditStyle = ({base, pin, key}: SubredditStyleProps) => {
  
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
/* Base Variables */
--subreddit-base: ${base};
--subreddit-pin: ${pin};
--subreddit-key: ${key};

/* Light Theme - Base */
--neutral-content: color-mix(in srgb, var(--subreddit-base), black 55%);
--neutral-content-disabled: color-mix(in srgb, var(--subreddit-base), white 76%);
--neutral-content-weak: color-mix(in srgb, var(--subreddit-base), black 18%);
--neutral-content-strong: color-mix(in srgb, var(--subreddit-base), black 79%);

--neutral-background: color-mix(in srgb, var(--subreddit-base), white 97%);
--neutral-background-selected: color-mix(in srgb, var(--subreddit-base), white 88%);
--neutral-background-weak: color-mix(in srgb, var(--subreddit-base), white 95%);
--neutral-background-medium: color-mix(in srgb, var(--subreddit-base), white 94%);
--neutral-background-strong: color-mix(in srgb, var(--subreddit-base), white 97%);
--neutral-background-hover: color-mix(in srgb, var(--subreddit-base), white 92%);
--neutral-background-container-strong: color-mix(in srgb, var(--subreddit-base), white 90%);
--neutral-background-container-strong-hover: color-mix(in srgb, var(--subreddit-base), white 87%);

--neutral-border-strong: color-mix(in srgb, var(--subreddit-base), black 79%);

--tone-1: color-mix(in srgb, var(--subreddit-base), black 84%);
--tone-2: color-mix(in srgb, var(--subreddit-base), black 48%);
--tone-3: color-mix(in srgb, var(--subreddit-base), white 51%);
--tone-4: color-mix(in srgb, var(--subreddit-base), white 84%);
--tone-5: color-mix(in srgb, var(--subreddit-base), white 91%);
--tone-6: color-mix(in srgb, var(--subreddit-base), white 94%);
--tone-7: color-mix(in srgb, var(--subreddit-base), white 97%);

--ui-canvas: color-mix(in srgb, var(--subreddit-base), white 91%);

--secondary: color-mix(in srgb, var(--subreddit-base), black 79%);
--secondary-weak: color-mix(in srgb, var(--subreddit-base), black 18%);
--secondary-background: color-mix(in srgb, var(--subreddit-base), white 88%);
--secondary-background-hover: color-mix(in srgb, var(--subreddit-base), white 85%);
--secondary-background-selected: color-mix(in srgb, var(--subreddit-base), white 78%);
--secondary-plain: color-mix(in srgb, var(--subreddit-base), black 79%);

/* Light Theme - Pinned */
--neutral-content: color-mix(in srgb, var(--subreddit-pin), black 75%);
--neutral-content-disabled: color-mix(in srgb, var(--subreddit-pin), white 95%);
--neutral-content-weak: color-mix(in srgb, var(--subreddit-pin), black 53%);
--neutral-content-strong: color-mix(in srgb, var(--subreddit-pin), black 90%);

--neutral-background: color-mix(in srgb, var(--subreddit-pin), white 94%);
--neutral-background-selected: color-mix(in srgb, var(--subreddit-pin), white 61%);
--neutral-background-weak: color-mix(in srgb, var(--subreddit-pin), white 86%);
--neutral-background-medium: color-mix(in srgb, var(--subreddit-pin), white 83%);
--neutral-background-strong: color-mix(in srgb, var(--subreddit-pin), white 94%);
--neutral-background-hover: color-mix(in srgb, var(--subreddit-pin), white 75%);
--neutral-background-container-strong: color-mix(in srgb, var(--subreddit-pin), white 69%);
--neutral-background-container-strong-hover: color-mix(in srgb, var(--subreddit-pin), white 55%);

--neutral-border-strong: color-mix(in srgb, var(--subreddit-pin), black 90%);

--tone-1: color-mix(in srgb, var(--subreddit-pin), black 93%);
--tone-2: color-mix(in srgb, var(--subreddit-pin), black 71%);
--tone-3: color-mix(in srgb, var(--subreddit-pin), black 24%);
--tone-4: color-mix(in srgb, var(--subreddit-pin), white 35%);
--tone-5: color-mix(in srgb, var(--subreddit-pin), white 72%);
--tone-6: color-mix(in srgb, var(--subreddit-pin), white 83%);
--tone-7: color-mix(in srgb, var(--subreddit-pin), white 94%);

--ui-canvas: color-mix(in srgb, var(--subreddit-pin), white 72%);

--secondary: color-mix(in srgb, var(--subreddit-pin), black 90%);
--secondary-weak: color-mix(in srgb, var(--subreddit-pin), black 53%);
--secondary-background: color-mix(in srgb, var(--subreddit-pin), white 61%);
--secondary-background-hover: color-mix(in srgb, var(--subreddit-pin), white 43%);
--secondary-background-selected: color-mix(in srgb, var(--subreddit-pin), white 4%);
--secondary-plain: color-mix(in srgb, var(--subreddit-pin), black 90%);

/* Light Theme - Primary */
--primary: color-mix(in srgb, var(--subreddit-key), black 4%);
--primary-hover: color-mix(in srgb, var(--subreddit-key), black 25%);
--primary-background: color-mix(in srgb, var(--subreddit-key), black 4%);
--primary-background-hover: color-mix(in srgb, var(--subreddit-key), black 25%);
--primary-background-selected: color-mix(in srgb, var(--subreddit-key), black 47%);

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark Theme - Base */
    --neutral-content: color-mix(in srgb, var(--subreddit-base), white 68%);
    --neutral-content-disabled: color-mix(in srgb, var(--subreddit-base), black 60%);
    --neutral-content-weak: color-mix(in srgb, var(--subreddit-base), white 34%);
    --neutral-content-strong: color-mix(in srgb, var(--subreddit-base), white 94%);

    --neutral-background: color-mix(in srgb, var(--subreddit-base), black 81%);
    --neutral-background-selected: color-mix(in srgb, var(--subreddit-base), black 67%);
    --neutral-background-weak: color-mix(in srgb, var(--subreddit-base), black 89%);
    --neutral-background-medium: color-mix(in srgb, var(--subreddit-base), black 81%);
    --neutral-background-strong: color-mix(in srgb, var(--subreddit-base), black 77%);
    --neutral-background-hover: color-mix(in srgb, var(--subreddit-base), black 73%);
    --neutral-background-container-strong: color-mix(in srgb, var(--subreddit-base), black 67%);
    --neutral-background-container-strong-hover: color-mix(in srgb, var(--subreddit-base), black 59%);

    --neutral-border-strong: color-mix(in srgb, var(--subreddit-base), white 94%);

    --tone-1: color-mix(in srgb, var(--subreddit-base), white 93%);
    --tone-2: color-mix(in srgb, var(--subreddit-base), white 54%);
    --tone-3: color-mix(in srgb, var(--subreddit-base), black 45%);
    --tone-4: color-mix(in srgb, var(--subreddit-base), black 60%);
    --tone-5: color-mix(in srgb, var(--subreddit-base), black 73%);
    --tone-6: color-mix(in srgb, var(--subreddit-base), black 81%);
    --tone-7: color-mix(in srgb, var(--subreddit-base), black 89%);

    --ui-canvas: color-mix(in srgb, var(--subreddit-base), black 89%);

    --secondary: color-mix(in srgb, var(--subreddit-base), white 94%);
    --secondary-weak: color-mix(in srgb, var(--subreddit-base), white 34%);
    --secondary-background: color-mix(in srgb, var(--subreddit-base), black 67%);
    --secondary-background-hover: color-mix(in srgb, var(--subreddit-base), black 60%);
    --secondary-background-selected: color-mix(in srgb, var(--subreddit-base), black 45%);
    --secondary-plain: color-mix(in srgb, var(--subreddit-base), white 94%);

    /* Dark Theme - Pinned */
    --neutral-content: color-mix(in srgb, var(--subreddit-pin), black 12%);
    --neutral-content-disabled: color-mix(in srgb, var(--subreddit-pin), black 78%);
    --neutral-content-weak: color-mix(in srgb, var(--subreddit-pin), black 34%);
    --neutral-content-strong: color-mix(in srgb, var(--subreddit-pin), white 83%);

    --neutral-background: color-mix(in srgb, var(--subreddit-pin), black 91%);
    --neutral-background-selected: color-mix(in srgb, var(--subreddit-pin), black 82%);
    --neutral-background-weak: color-mix(in srgb, var(--subreddit-pin), black 96%);
    --neutral-background-medium: color-mix(in srgb, var(--subreddit-pin), black 91%);
    --neutral-background-strong: color-mix(in srgb, var(--subreddit-pin), black 89%);
    --neutral-background-hover: color-mix(in srgb, var(--subreddit-pin), black 86%);
    --neutral-background-container-strong: color-mix(in srgb, var(--subreddit-pin), black 82%);
    --neutral-background-container-strong-hover: color-mix(in srgb, var(--subreddit-pin), black 77%);

    --neutral-border-strong: color-mix(in srgb, var(--subreddit-pin), white 83%);

    --tone-1: color-mix(in srgb, var(--subreddit-pin), white 80%);
    --tone-2: color-mix(in srgb, var(--subreddit-pin), black 22%);
    --tone-3: color-mix(in srgb, var(--subreddit-pin), black 69%);
    --tone-4: color-mix(in srgb, var(--subreddit-pin), black 78%);
    --tone-5: color-mix(in srgb, var(--subreddit-pin), black 86%);
    --tone-6: color-mix(in srgb, var(--subreddit-pin), black 91%);
    --tone-7: color-mix(in srgb, var(--subreddit-pin), black 96%);

    --ui-canvas: color-mix(in srgb, var(--subreddit-pin), black 96%);

    --secondary: color-mix(in srgb, var(--subreddit-pin), white 83%);
    --secondary-weak: color-mix(in srgb, var(--subreddit-pin), black 34%);
    --secondary-background: color-mix(in srgb, var(--subreddit-pin), black 82%);
    --secondary-background-hover: color-mix(in srgb, var(--subreddit-pin), black 78%);
    --secondary-background-selected: color-mix(in srgb, var(--subreddit-pin), black 69%);
    --secondary-plain: color-mix(in srgb, var(--subreddit-pin), white 83%);

    /* Dark Theme - Primary */
    --primary: color-mix(in srgb, var(--subreddit-key), white 58%);
    --primary-hover: color-mix(in srgb, var(--subreddit-key), white 77%);
    --primary-background: color-mix(in srgb, var(--subreddit-key), black 0%);
    --primary-background-hover: color-mix(in srgb, var(--subreddit-key), white 38%);
    --primary-background-selected: color-mix(in srgb, var(--subreddit-key), white 58%);
  }
}
    `,
      }}
    />
  );
}
