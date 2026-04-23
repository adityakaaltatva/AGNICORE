import { useState } from 'react';
import { Cpu, MapPinned, Radar, ShieldEllipsis } from 'lucide-react';
import { SimulationInput } from '../types';

interface SimulationFormProps {
  readonly onSimulate: (input: SimulationInput) => void;
}

const deviceOptions = ['Linux', 'Windows', 'Mobile', 'Unknown'];
const locationOptions = ['Trusted', 'External', 'Unknown'];
const sensitivityOptions = ['Standard', 'Sensitive', 'Privileged'];
const actionOptions = ['read', 'write', 'approve'];

export default function SimulationForm({ onSimulate }: SimulationFormProps) {
  const [device, setDevice] = useState('Linux');
  const [location, setLocation] = useState('Trusted');
  const [requestFrequency, setRequestFrequency] = useState(50);
  const [sensitivity, setSensitivity] = useState('Sensitive');
  const [action, setAction] = useState('write');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSimulate({ device, location, requestFrequency, sensitivity, action });
  };

  const postureText =
    requestFrequency > 70
      ? 'Traffic is spiking beyond the expected baseline.'
      : requestFrequency > 50
        ? 'Behavior is elevated and may require more scrutiny.'
        : 'Request pattern remains within normal bounds.';

  return (
    <form onSubmit={handleSubmit} className="glass-panel-strong section-shell space-y-6">
      <div className="space-y-3">
        <p className="eyebrow">Request Composer</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="panel-title text-2xl">Simulate an access request</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">
              Adjust context, device trust, and behavior to see how AGNICORE moves from signal
              intake to final policy decision.
            </p>
          </div>
          <button type="submit" className="button-primary">
            <Radar className="h-4 w-4" />
            Run evaluation
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="glass-inset rounded-[24px] p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-200">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Identity and device trust</p>
              <p className="text-xs text-slate-400">Endpoint posture and intended action</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Device type</span>
              <select
                value={device}
                onChange={(event) => setDevice(event.target.value)}
                className="field-shell w-full"
              >
                {deviceOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Action requested</span>
              <select
                value={action}
                onChange={(event) => setAction(event.target.value)}
                className="field-shell w-full"
              >
                {actionOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="glass-inset rounded-[24px] p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-amber-300/10 p-3 text-amber-100">
              <MapPinned className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Context and sensitivity</p>
              <p className="text-xs text-slate-400">Location confidence and resource profile</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Location confidence</span>
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="field-shell w-full"
              >
                {locationOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Resource sensitivity</span>
              <select
                value={sensitivity}
                onChange={(event) => setSensitivity(event.target.value)}
                className="field-shell w-full"
              >
                {sensitivityOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      </div>

      <section className="glass-inset rounded-[24px] p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-rose-400/10 p-3 text-rose-100">
            <ShieldEllipsis className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Behavior pressure</p>
            <p className="text-xs text-slate-400">How far the request deviates from baseline</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Request frequency</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-white">
              {requestFrequency}/100
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={requestFrequency}
            onChange={(event) => setRequestFrequency(Number(event.target.value))}
            className="w-full accent-rose-400"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-black/10 p-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Low drift</p>
              <p className="mt-2 text-sm text-slate-300">Baseline-aligned request behavior.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/10 p-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current read</p>
              <p className="mt-2 text-sm text-slate-200">{postureText}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/10 p-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">High drift</p>
              <p className="mt-2 text-sm text-slate-300">Triggers stronger controls and review.</p>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}
