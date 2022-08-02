import { Color, ColorPicker } from 'react-color-palette';
import { fontFaceOptions } from './pptOptions';

type Props = {
  fontFace: string;
  bold: boolean;
  italic: boolean;
  color: Color;
  backgroundColor: Color;
  setFontFace: React.Dispatch<React.SetStateAction<string>>;
  setBold: React.Dispatch<React.SetStateAction<boolean>>;
  setItalic: React.Dispatch<React.SetStateAction<boolean>>;
  setColor: React.Dispatch<React.SetStateAction<Color>>;
  setBackgroundColor: React.Dispatch<React.SetStateAction<Color>>;
};

export default function PptOptionsForm({
  fontFace,
  bold,
  italic,
  color,
  backgroundColor,
  setFontFace,
  setBold,
  setItalic,
  setColor,
  setBackgroundColor,
}: Props) {
  return (
    <div
      style={{
        width: '300px',
        margin: '0 auto',
      }}
    >
      <fieldset style={{ border: 0, padding: 0 }}>
        <div className="form-element-container">
          <label htmlFor="ppt-font" style={{ display: 'block' }}>
            Font
          </label>
          <select
            id="ppt-font"
            name="ppt-font"
            value={fontFace}
            onChange={e => setFontFace(e.target.value)}
          >
            {fontFaceOptions.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            id="ppt-bold"
            name="ppt-bold"
            checked={bold}
            onChange={() => setBold(prevState => !prevState)}
          />
          <span>Bold</span>
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            id="ppt-italic"
            name="ppt-italic"
            checked={italic}
            onChange={() => setItalic(prevState => !prevState)}
          />
          Italic
        </label>

        <div className="form-element-container">
          <label>Font color</label>
          <ColorPicker
            width={250}
            height={150}
            color={color}
            onChange={setColor}
            hideHSV
            hideRGB
            dark={false}
          />
        </div>
      </fieldset>
      <div>
        <div className="form-element-container">
          <label>Background color</label>
          <ColorPicker
            width={250}
            height={150}
            color={backgroundColor}
            onChange={setBackgroundColor}
            hideHSV
            hideRGB
            dark={false}
          />
        </div>
      </div>
      {/* TODO: add translation */}
      <style jsx>{`
        select {
          font-size: 1rem;
          padding: 0.2rem 0.2rem;
          box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.05);
        }
        label {
          display: block;
          padding-bottom: 0.5rem;
          font-weight: bold;
        }
        .form-element-container {
          padding: 0.5rem;
        }
        .checkbox {
          padding: 0.5rem;
          display: flex;
          align-items: baseline;
        }
      `}</style>
    </div>
  );
}
