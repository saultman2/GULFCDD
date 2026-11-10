export function FormHoneypot() {
  return (
    <div className="form-honeypot" aria-hidden="true"
      style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>
      <label>Leave this field empty
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off"
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />
      </label>
    </div>
  );
}
