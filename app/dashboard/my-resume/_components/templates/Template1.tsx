import { ResumeData } from '../types'

export default function Template1({ data }: { data: ResumeData }) {
  const firstName = data.firstName || 'Sudha'
  const lastName = data.lastName || 'Lakshmi. R'
  const accentColor = '#1e3a8a' // Navy Blue
  const dividerStyle = 'border-b-2 border-[#1e3a8a] mb-3'

  return (
    <div className="bg-white text-black w-[210mm] min-h-[297mm] p-[12mm] text-[10pt] font-sans leading-normal shadow-2xl print:shadow-none print:p-0 mx-auto">
      
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
          {firstName} {lastName}
        </h1>
        <div className="text-[9pt] text-gray-700 flex flex-wrap justify-center items-center gap-1.5">
          {data.email && <span>{data.email}</span>}
          {(data.email && data.phone) && <span>|</span>}
          {data.phone && <span>{data.phone}</span>}
          {((data.email || data.phone) && data.location) && <span>|</span>}
          {data.location && <span>{data.location}</span>}
        </div>
        <div className="text-[9pt] flex flex-wrap justify-center items-center gap-2 mt-1">
          {data.linkedinUrl && (
            <a href={data.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">LinkedIn</a>
          )}
          {data.linkedinUrl && data.githubUrl && <span>|</span>}
          {data.githubUrl && (
            <a href={data.githubUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">GitHub</a>
          )}
          {(data.linkedinUrl || data.githubUrl) && data.portfolioUrl && <span>|</span>}
          {data.portfolioUrl && (
            <a href={data.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">Portfolio</a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.aiBio && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            Professional Summary
          </h2>
          <div className={dividerStyle} />
          <p className="text-justify leading-relaxed text-gray-800">{data.aiBio}</p>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            Education
          </h2>
          <div className={dividerStyle} />
          {data.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <span>{edu.degree}</span>
                <span className="text-[9pt] font-normal text-gray-500">{edu.date}</span>
              </div>
              <div className="text-gray-700">{edu.school}</div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {(data.languages?.length > 0 || data.coreSkills?.length > 0 || data.frameworks?.length > 0 || data.tools?.length > 0 || data.languagesKnown) && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            Skills
          </h2>
          <div className={dividerStyle} />
          <div className="space-y-1 text-gray-800">
            {data.languages?.length > 0 && (
              <div>
                <span className="font-bold">Technical Skills:</span> {data.languages.join(', ')}
              </div>
            )}
            {data.frameworks?.length > 0 && (
              <div>
                <span className="font-bold">Frameworks:</span> {data.frameworks.join(', ')}
              </div>
            )}
            {data.tools?.length > 0 && (
              <div>
                <span className="font-bold">Tools:</span> {data.tools.join(', ')}
              </div>
            )}
            {data.coreSkills?.length > 0 && (
              <div>
                <span className="font-bold">Soft Skills:</span> {data.coreSkills.join(', ')}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Internships / Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            Internships
          </h2>
          <div className={dividerStyle} />
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <div className="font-bold text-gray-900">
                  {exp.title} — <span className="font-semibold text-gray-700">{exp.company}</span>
                </div>
                <div className="text-[9pt] text-gray-500 font-normal">{exp.date}</div>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-800 ml-1">
                {exp.description.split('\n').filter(Boolean).map((bullet, j) => (
                  <li key={j} className="text-justify leading-relaxed">
                    {bullet.replace(/^-\s*/, '')}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            Projects
          </h2>
          <div className={dividerStyle} />
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <div className="font-bold text-gray-900">
                  {proj.name} {proj.tech && <span className="font-normal text-gray-600">| Tech Stack: {proj.tech}</span>}
                </div>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-800 ml-1">
                {proj.description.split('\n').filter(Boolean).map((bullet, j) => (
                  <li key={j} className="text-justify leading-relaxed">
                    {bullet.replace(/^-\s*/, '')}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            Certifications
          </h2>
          <div className={dividerStyle} />
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            {data.certifications.map((cert, i) => (
              <li key={i}>
                <span className="font-bold">{cert.name}</span> — {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            Achievements
          </h2>
          <div className={dividerStyle} />
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            {data.achievements.filter(Boolean).map((ach, i) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages Known */}
      {data.languagesKnown && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            Languages Known
          </h2>
          <div className={dividerStyle} />
          <div className="text-gray-800">{data.languagesKnown}</div>
        </section>
      )}

    </div>
  )
}
