interface PatientDetailsFormProps {
  name: string;
  dob: string;
  maxDob: string;
  onNameChange: (value: string) => void;
  onDobChange: (value: string) => void;
}

export function PatientDetailsForm({ name, dob, maxDob, onNameChange, onDobChange }: PatientDetailsFormProps) {
  return (
    <form className="reading-form" onSubmit={(e) => e.preventDefault()}>
      <div className="field grow">
        <label htmlFor="patientName">Patient name</label>
        <input
          type="text"
          id="patientName"
          placeholder="Full name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="patientDob">Date of birth</label>
        <input
          type="date"
          id="patientDob"
          max={maxDob}
          value={dob}
          onChange={(e) => onDobChange(e.target.value)}
        />
      </div>
    </form>
  );
}
