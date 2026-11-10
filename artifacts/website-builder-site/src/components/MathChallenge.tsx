interface MathChallengeProps {
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function isMathChallengeCorrect(value: string) {
  return value.trim() === "2";
}

export function MathChallenge({
  id,
  value,
  error,
  onChange,
}: MathChallengeProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-primary"
      >
        Quick check: what is 1 + 1?
      </label>
      <input
        id={id}
        name="mathAnswer"
        required
        pattern="2"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 w-full max-w-48 rounded-md border border-slate-300 bg-white px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
