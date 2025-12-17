import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { GenerationResult, Persona, InterviewGuide, SurveyGuide } from "@/types";

// Define styles matching the design system
const colors = {
  primary: "#1F1F1F",
  accent: "#2383E2",
  secondary: "#014379",
  text: "#2F2F2F",
  textLight: "#666666",
  white: "#FFFFFF",
  border: "#E5E5E5",
  background: "#F9F9F9",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: colors.white,
    fontFamily: "Helvetica",
  },
  // Cover Page
  coverPage: {
    padding: 60,
    backgroundColor: colors.primary,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 18,
    color: colors.accent,
    textAlign: "center",
    marginBottom: 40,
  },
  coverMeta: {
    fontSize: 12,
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 60,
  },
  // Headers
  pageHeader: {
    borderBottom: `2px solid ${colors.accent}`,
    paddingBottom: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
  // Persona Card
  personaHeader: {
    backgroundColor: colors.accent,
    padding: 20,
    marginBottom: 20,
    borderRadius: 4,
  },
  personaType: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 5,
  },
  personaTagline: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  // Content sections
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  paragraph: {
    fontSize: 11,
    color: colors.text,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 6,
  },
  // Lists
  list: {
    marginLeft: 10,
  },
  listItem: {
    fontSize: 11,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  bullet: {
    color: colors.accent,
    marginRight: 8,
  },
  // Quotes
  quote: {
    backgroundColor: colors.background,
    padding: 12,
    marginBottom: 8,
    borderLeft: `3px solid ${colors.accent}`,
  },
  quoteText: {
    fontSize: 11,
    color: colors.text,
    fontStyle: "italic",
    lineHeight: 1.5,
  },
  // Two column layout
  row: {
    flexDirection: "row",
    marginBottom: 15,
  },
  column: {
    flex: 1,
    paddingRight: 15,
  },
  columnLast: {
    flex: 1,
    paddingLeft: 15,
  },
  // Table styles
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: "bold",
    color: colors.white,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${colors.border}`,
    padding: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: colors.textLight,
  },
  pageNumber: {
    fontSize: 9,
    color: colors.textLight,
  },
});

// Helper Components
const ListItem = ({ children }: { children: string }) => (
  <View style={{ flexDirection: "row", marginBottom: 4 }}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.listItem}>{children}</Text>
  </View>
);

const LabelValue = ({ label, value }: { label: string; value: string }) => (
  <View style={{ marginBottom: 6 }}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// Persona Page Component
const PersonaPage = ({
  persona,
  index,
  total,
  productName,
}: {
  persona: Persona;
  index: number;
  total: number;
  productName: string;
}) => (
  <Page size="A4" style={styles.page}>
    {/* Header */}
    <View style={styles.pageHeader}>
      <Text style={styles.sectionTitle}>
        Persona {index + 1} of {total}
      </Text>
      <Text style={styles.sectionSubtitle}>{productName}</Text>
    </View>

    {/* Persona Header */}
    <View style={styles.personaHeader}>
      <Text style={styles.personaType}>{persona.type}</Text>
      <Text style={styles.personaTagline}>{persona.tagline}</Text>
    </View>

    {/* Background & Demographics */}
    <View style={styles.row}>
      <View style={styles.column}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Background</Text>
          <Text style={styles.paragraph}>{persona.background.summary}</Text>
          <LabelValue label="Work Context" value={persona.background.workContext} />
          <LabelValue
            label="Domain Familiarity"
            value={persona.background.domainFamiliarity}
          />
        </View>
      </View>
      {persona.demographics && (
        <View style={styles.columnLast}>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Demographics</Text>
            {persona.demographics.ageRange && (
              <LabelValue label="Age Range" value={persona.demographics.ageRange} />
            )}
            {persona.demographics.location && (
              <LabelValue label="Location" value={persona.demographics.location} />
            )}
            {persona.demographics.education && (
              <LabelValue label="Education" value={persona.demographics.education} />
            )}
            {persona.demographics.incomeRange && (
              <LabelValue label="Income" value={persona.demographics.incomeRange} />
            )}
          </View>
        </View>
      )}
    </View>

    {/* Goals & Pain Points */}
    <View style={styles.row}>
      <View style={styles.column}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Goals & Outcomes</Text>
          {persona.goals.primary.map((goal, i) => (
            <ListItem key={i}>{goal}</ListItem>
          ))}
          <LabelValue
            label="Success Looks Like"
            value={persona.goals.successDefinition}
          />
        </View>
      </View>
      <View style={styles.columnLast}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Pain Points</Text>
          {persona.painPoints.challenges.map((pain, i) => (
            <ListItem key={i}>{pain}</ListItem>
          ))}
        </View>
      </View>
    </View>

    {/* Behaviors & Needs */}
    <View style={styles.row}>
      <View style={styles.column}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Behaviors & Habits</Text>
          {persona.behaviors.routines.slice(0, 3).map((behavior, i) => (
            <ListItem key={i}>{behavior}</ListItem>
          ))}
          <LabelValue
            label="Preferred Channels"
            value={persona.behaviors.preferredChannels.join(", ")}
          />
        </View>
      </View>
      <View style={styles.columnLast}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Core Needs</Text>
          {persona.needs.core.map((need, i) => (
            <ListItem key={i}>{need}</ListItem>
          ))}
        </View>
      </View>
    </View>

    {/* Quotes */}
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Representative Quotes</Text>
      {persona.quotes.slice(0, 2).map((quote, i) => (
        <View key={i} style={styles.quote}>
          <Text style={styles.quoteText}>&ldquo;{quote}&rdquo;</Text>
        </View>
      ))}
    </View>

    {/* Footer */}
    <View style={styles.footer}>
      <Text style={styles.footerText}>Generated by Persona Builder</Text>
      <Text style={styles.pageNumber}>Page {index + 2}</Text>
    </View>
  </Page>
);

// Persona Details Page (continued)
const PersonaDetailsPage = ({
  persona,
  index,
  productName,
}: {
  persona: Persona;
  index: number;
  productName: string;
}) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.pageHeader}>
      <Text style={styles.sectionTitle}>{persona.type} - Details</Text>
      <Text style={styles.sectionSubtitle}>{productName}</Text>
    </View>

    {/* Motivations & Technology */}
    <View style={styles.row}>
      <View style={styles.column}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Motivations & Drivers</Text>
          <LabelValue
            label="Intrinsic Motivators"
            value={persona.motivations.intrinsic.join(", ")}
          />
          <LabelValue label="Values" value={persona.motivations.values.join(", ")} />
        </View>
      </View>
      <View style={styles.columnLast}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Technology Profile</Text>
          <LabelValue label="Devices" value={persona.technology.devices.join(", ")} />
          <LabelValue label="Tools" value={persona.technology.tools.join(", ")} />
          <LabelValue label="Tech Comfort" value={persona.technology.techComfort} />
        </View>
      </View>
    </View>

    {/* Tasks & Context */}
    <View style={styles.row}>
      <View style={styles.column}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Key Tasks</Text>
          {persona.tasks.primary.map((task, i) => (
            <ListItem key={i}>{task}</ListItem>
          ))}
          <LabelValue
            label="High-Value Scenarios"
            value={persona.tasks.highValueScenarios.join("; ")}
          />
        </View>
      </View>
      <View style={styles.columnLast}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Context of Use</Text>
          <LabelValue label="Environment" value={persona.context.environment} />
          <LabelValue label="Timing" value={persona.context.timing} />
          <LabelValue
            label="Constraints"
            value={persona.context.constraints.join(", ")}
          />
        </View>
      </View>
    </View>

    {/* Objections */}
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Objections & Barriers</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Adoption Barriers</Text>
          {persona.objections.barriers.map((barrier, i) => (
            <ListItem key={i}>{barrier}</ListItem>
          ))}
        </View>
        <View style={styles.columnLast}>
          <Text style={styles.label}>Switching Costs</Text>
          {persona.objections.switchingCosts.map((cost, i) => (
            <ListItem key={i}>{cost}</ListItem>
          ))}
        </View>
      </View>
    </View>

    {/* Key Insights */}
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Key Insights & Design Implications</Text>
      {persona.insights.keyTakeaways.map((insight, i) => (
        <ListItem key={i}>{insight}</ListItem>
      ))}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.label}>Opportunities</Text>
        {persona.insights.opportunities.map((opp, i) => (
          <ListItem key={i}>{opp}</ListItem>
        ))}
      </View>
    </View>

    {/* Assumptions */}
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Assumptions & Research Needs</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Validated</Text>
          {persona.assumptions.validated.map((item, i) => (
            <ListItem key={i}>{item}</ListItem>
          ))}
        </View>
        <View style={styles.columnLast}>
          <Text style={styles.label}>Needs Research</Text>
          {persona.assumptions.toResearch.map((item, i) => (
            <ListItem key={i}>{item}</ListItem>
          ))}
        </View>
      </View>
    </View>

    <View style={styles.footer}>
      <Text style={styles.footerText}>Generated by Persona Builder</Text>
      <Text style={styles.pageNumber}>Page {index * 2 + 3}</Text>
    </View>
  </Page>
);

// Interview Guide Page
const InterviewGuidePage = ({
  guide,
  productName,
  pageNum,
}: {
  guide: InterviewGuide;
  productName: string;
  pageNum: number;
}) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.pageHeader}>
      <Text style={styles.sectionTitle}>Interview Guide</Text>
      <Text style={styles.sectionSubtitle}>{productName}</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Introduction</Text>
      <Text style={styles.paragraph}>{guide.introduction}</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Warmup Questions</Text>
      {guide.warmupQuestions.map((q, i) => (
        <ListItem key={i}>{q}</ListItem>
      ))}
    </View>

    {guide.coreQuestions.map((category, i) => (
      <View key={i} style={styles.section}>
        <Text style={styles.sectionHeader}>{category.category}</Text>
        {category.questions.map((q, j) => (
          <ListItem key={j}>{q}</ListItem>
        ))}
      </View>
    ))}

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Closing Questions</Text>
      {guide.closingQuestions.map((q, i) => (
        <ListItem key={i}>{q}</ListItem>
      ))}
    </View>

    <View style={styles.footer}>
      <Text style={styles.footerText}>Generated by Persona Builder</Text>
      <Text style={styles.pageNumber}>Page {pageNum}</Text>
    </View>
  </Page>
);

// Main PDF Document Component
export const PersonaDocument = ({ result }: { result: GenerationResult }) => {
  const personaPageCount = result.personas.length * 2;
  let currentPage = personaPageCount + 2;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>User Personas</Text>
        <Text style={styles.coverSubtitle}>{result.productName}</Text>
        <Text style={{ ...styles.coverSubtitle, fontSize: 14, marginTop: 20 }}>
          {result.personas.length} Personas Generated
        </Text>
        <Text style={styles.coverMeta}>
          Generated on {new Date(result.generatedAt).toLocaleDateString()}
        </Text>
        <Text style={{ ...styles.coverMeta, marginTop: 10 }}>
          Powered by Persona Builder
        </Text>
      </Page>

      {/* Persona Pages */}
      {result.personas.map((persona, index) => (
        <React.Fragment key={persona.id}>
          <PersonaPage
            persona={persona}
            index={index}
            total={result.personas.length}
            productName={result.productName}
          />
          <PersonaDetailsPage
            persona={persona}
            index={index}
            productName={result.productName}
          />
        </React.Fragment>
      ))}

      {/* Interview Guide */}
      {result.interviewGuide && (
        <InterviewGuidePage
          guide={result.interviewGuide}
          productName={result.productName}
          pageNum={currentPage++}
        />
      )}
    </Document>
  );
};

export default PersonaDocument;
