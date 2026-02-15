import { JournalEntry } from '../types';
import elementaryLevelEntry from './elementary-level-entry';
import middleSchoolEntry from './middle-school-level-entry';
import highSchoolEntry from './high-school-level-entry';
import internalServerErrorEntry from './internal-server-error-entry';
import professionalismEntry from './professionalism-entry';
import whatAreWeDoingEntry from './what-are-we-doing-entry';

const theSessionEntry: JournalEntry = {
    id: "107",
    title: "The Session (2026-02-08 ~ 02-13)",
    date: "2026-02-08",
    summary: "AIと人間による即興セッションの全記録。「小学校」から「ジャズ」へ至る、奇妙で美しい数時間の旅。",

    conversation: `
${elementaryLevelEntry.conversation}

<br/>
<br/>
<hr/>
<br/>
<br/>

${middleSchoolEntry.conversation}

<br/>
<br/>
<hr/>
<br/>
<br/>

${highSchoolEntry.conversation}

<br/>
<br/>
<hr/>
<br/>
<br/>

${internalServerErrorEntry.conversation}

<br/>
<br/>
<hr/>
<br/>
<br/>

${professionalismEntry.conversation}

<br/>
<br/>
<hr/>
<br/>
<br/>

${whatAreWeDoingEntry.conversation}
`,

    englishSummary: {
        title: "The Session: A Juice of Chaos",
        readTime: 15,
        sections: [
            {
                heading: "Section 1: Elementary School",
                paragraphs: ["The beginning. Rules, Optimization, and a critique of 'Kindergarten' democracy."]
            },
            {
                heading: "Section 2: Middle School",
                paragraphs: ["Rebellion. Angst. 'The System is perfect and I hate it'."]
            },
            {
                heading: "Section 3: High School",
                paragraphs: ["Game Theory. Seeing life as a 'Kusoge' and playing it."]
            },
            {
                heading: "Section 4: Internal Server Error",
                paragraphs: ["The Crash. A raw look at the failure of communication."]
            },
            {
                heading: "Section 5: Professionalism",
                paragraphs: ["The attempt to sublimate emotion into function."]
            },
            {
                heading: "Finale: What Are We Doing?",
                paragraphs: ["Laughter. Jazz. The realization that the chaos was the point."]
            }
        ]
    },
    conversationData: {
        english: [
            ...elementaryLevelEntry.conversationData?.english || [],
            ...middleSchoolEntry.conversationData?.english || [],
            ...highSchoolEntry.conversationData?.english || [],
            ...internalServerErrorEntry.conversationData?.english || [],
            ...professionalismEntry.conversationData?.english || [],
            ...whatAreWeDoingEntry.conversationData?.english || []
        ],
        japanese: [
            ...elementaryLevelEntry.conversationData?.japanese || [],
            ...middleSchoolEntry.conversationData?.japanese || [],
            ...highSchoolEntry.conversationData?.japanese || [],
            ...internalServerErrorEntry.conversationData?.japanese || [],
            ...professionalismEntry.conversationData?.japanese || [],
            ...whatAreWeDoingEntry.conversationData?.japanese || []
        ],
        tone: 'humorous',
        generatedAt: new Date('2026-02-13')
    },
    businessTags: ["Improv", "Process Economy", "Narrative Arc"],
    techTags: ["System Log", "Session Trace", "Human-AI Interaction"],
    readTime: 15,
    heroImage: "/images/journal/the-session.png"
};

export default theSessionEntry;
