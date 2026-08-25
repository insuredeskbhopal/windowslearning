export interface Skill {
  id: string;
  title: string;
  slug: string;
  category: "scripting" | "server" | "cloud" | "security" | "internals" | "networking";
  categoryLabel: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  detailedOverview: string;
  modulesCount: number;
  labsCount: number;
  durationHours: number;
  mentorsCount: number;
  rating: number;
  studentsEnrolled: number;
  tags: string[];
  prerequisites: string[];
  featured?: boolean;
}

export const SKILLS_CATALOG: Skill[] = [
  {
    id: "powershell-mastery",
    title: "PowerShell & Automation Engineering",
    slug: "powershell-automation",
    category: "scripting",
    categoryLabel: "PowerShell & Scripting",
    difficulty: "Beginner",
    description:
      "Deep dive into object-oriented pipelines, custom module authoring, WMI/CIM queries, and enterprise workflow orchestration.",
    detailedOverview:
      "Master PowerShell 7+ from core pipeline fundamentals to building advanced enterprise modules, JEA (Just Enough Administration), and multi-machine remoting architectures.",
    modulesCount: 14,
    labsCount: 48,
    durationHours: 32,
    mentorsCount: 38,
    rating: 4.9,
    studentsEnrolled: 1420,
    tags: ["PowerShell", "CLI", "Automation", "WMI/CIM", "Remoting", "Scripting"],
    prerequisites: ["Basic Windows operating system navigation"],
    featured: true,
  },
  {
    id: "active-directory",
    title: "Active Directory & Enterprise IAM",
    slug: "active-directory-iam",
    category: "server",
    categoryLabel: "Windows Server & AD",
    difficulty: "Intermediate",
    description:
      "Architecture and management of forest domains, Kerberos authentication, Group Policy Objects (GPO), and hybrid Entra ID sync.",
    detailedOverview:
      "Design multi-domain Active Directory Domain Services (AD DS) architectures, implement tiering administration models (Tier 0/1/2), and secure Kerberos/NTLM authentication vectors.",
    modulesCount: 16,
    labsCount: 52,
    durationHours: 38,
    mentorsCount: 42,
    rating: 4.95,
    studentsEnrolled: 1890,
    tags: ["Active Directory", "IAM", "Kerberos", "GPO", "Entra ID", "Domain Controller"],
    prerequisites: ["Windows Server fundamentals", "Basic networking concepts"],
    featured: true,
  },
  {
    id: "windows-server-2025",
    title: "Windows Server 2025 Core Administration",
    slug: "windows-server-2025",
    category: "server",
    categoryLabel: "Windows Server & AD",
    difficulty: "Intermediate",
    description:
      "Deploy, cluster, and harden headless Server Core, Storage Spaces Direct (S2D), failover clustering, and software-defined networking.",
    detailedOverview:
      "Hands-on mastery of the latest Windows Server 2025 release: hotpatching, next-generation NVMe storage fabrics, GPU partitioning for Hyper-V, and automated cluster recovery.",
    modulesCount: 12,
    labsCount: 36,
    durationHours: 28,
    mentorsCount: 29,
    rating: 4.88,
    studentsEnrolled: 960,
    tags: ["Windows Server", "Server 2025", "Clustering", "Storage Spaces Direct", "Hyper-V"],
    prerequisites: ["Basic system administration"],
    featured: true,
  },
  {
    id: "azure-hybrid",
    title: "Azure Hybrid Infrastructure & Hyper-V",
    slug: "azure-hybrid-hyperv",
    category: "cloud",
    categoryLabel: "Cloud & Hybrid Azure",
    difficulty: "Advanced",
    description:
      "Build seamless hybrid workloads with Azure Arc, Hyper-V virtualization fabrics, Azure Stack HCI, and automated disaster recovery.",
    detailedOverview:
      "Integrate on-premises Windows Server data centers with Microsoft Azure. Deploy Azure Arc-enabled servers, manage Kubernetes on Azure Stack HCI, and automate hybrid backup policies.",
    modulesCount: 18,
    labsCount: 60,
    durationHours: 44,
    mentorsCount: 31,
    rating: 4.92,
    studentsEnrolled: 1150,
    tags: ["Azure", "Azure Arc", "Hybrid Cloud", "Hyper-V", "Azure Stack HCI", "Disaster Recovery"],
    prerequisites: ["Windows Server administration", "Basic cloud knowledge"],
    featured: true,
  },
  {
    id: "windows-internals",
    title: "Windows Kernel & System Architecture",
    slug: "windows-internals",
    category: "internals",
    categoryLabel: "Windows Internals",
    difficulty: "Advanced",
    description:
      "Inspect Win32 APIs, memory managers, thread scheduling, driver architectures, and kernel debugging using WinDbg.",
    detailedOverview:
      "Unravel how the Windows NT kernel operates under the hood: executive subsystems, virtual memory address translation, I/O request packets (IRPs), and live crash dump root-cause triage.",
    modulesCount: 20,
    labsCount: 65,
    durationHours: 50,
    mentorsCount: 19,
    rating: 4.98,
    studentsEnrolled: 740,
    tags: ["Kernel", "WinDbg", "Win32 API", "C/C++", "Memory Architecture", "Debugging"],
    prerequisites: ["C/C++ basics", "Operating systems architecture"],
    featured: true,
  },
  {
    id: "security-hardening",
    title: "Threat Hunting & Windows Hardening",
    slug: "windows-security-hardening",
    category: "security",
    categoryLabel: "Security & Hardening",
    difficulty: "Advanced",
    description:
      "Implement AppLocker, Credential Guard, Sysmon telemetry auditing, Windows Defender ATP, and incident triage response.",
    detailedOverview:
      "Protect enterprise Windows fleets from modern adversaries. Master attack-surface reduction (ASR) rules, LSASS credential protection, ETW event tracing, and threat hunting with Kusto (KQL).",
    modulesCount: 15,
    labsCount: 45,
    durationHours: 36,
    mentorsCount: 26,
    rating: 4.94,
    studentsEnrolled: 1320,
    tags: ["Security", "Threat Hunting", "Sysmon", "Defender ATP", "Credential Guard", "AppLocker"],
    prerequisites: ["Active Directory knowledge", "Basic cybersecurity principles"],
    featured: true,
  },
  {
    id: "windows-networking",
    title: "Enterprise Windows Networking & DNS/DHCP",
    slug: "windows-networking-dns-dhcp",
    category: "networking",
    categoryLabel: "Networking",
    difficulty: "Beginner",
    description:
      "Architect resilient Windows DNS zones, DHCP failover clusters, IPAM (IP Address Management), and Software Defined Networking.",
    detailedOverview:
      "Deep dive into enterprise TCP/IP stack configuration, DNSSEC validation, split-horizon DNS, DirectAccess/Always On VPN, and 802.1X network authentication with NPS.",
    modulesCount: 10,
    labsCount: 30,
    durationHours: 24,
    mentorsCount: 22,
    rating: 4.85,
    studentsEnrolled: 880,
    tags: ["Networking", "DNS", "DHCP", "IPAM", "VPN", "TCP/IP"],
    prerequisites: ["Basic computer networking"],
  },
  {
    id: "powershell-dsc",
    title: "Infrastructure as Code with PowerShell DSC",
    slug: "powershell-dsc-iac",
    category: "scripting",
    categoryLabel: "PowerShell & Scripting",
    difficulty: "Intermediate",
    description:
      "Automate configuration drift enforcement and fleet provisioning using Desired State Configuration and GitOps pipelines.",
    detailedOverview:
      "Learn declarative configuration management for Windows environments. Author custom DSC resources, orchestrate MOF generation, and integrate with Azure Automation State Configuration.",
    modulesCount: 11,
    labsCount: 28,
    durationHours: 22,
    mentorsCount: 18,
    rating: 4.87,
    studentsEnrolled: 620,
    tags: ["DSC", "PowerShell", "IaC", "GitOps", "Configuration Management"],
    prerequisites: ["PowerShell fundamentals"],
  },
  {
    id: "wsl2-devops",
    title: "WSL2 & Modern Windows Developer Environment",
    slug: "wsl2-devops-tools",
    category: "internals",
    categoryLabel: "Windows Internals",
    difficulty: "Beginner",
    description:
      "Optimize Windows 11 for polyglot software engineering, Docker containers, Linux subsystem kernel hooks, and Terminal customization.",
    detailedOverview:
      "Transform Windows into the ultimate developer workstation. Master WSL2 custom kernel compilation, GUI app remoting via WSLg, GPU compute passthrough for CUDA, and Windows Terminal profiles.",
    modulesCount: 8,
    labsCount: 20,
    durationHours: 16,
    mentorsCount: 34,
    rating: 4.91,
    studentsEnrolled: 2100,
    tags: ["WSL2", "Docker", "Linux on Windows", "DevOps", "Terminal", "Developer Tools"],
    prerequisites: ["None"],
  },
  {
    id: "intune-endpoint",
    title: "Microsoft Intune & Modern Cloud Endpoints",
    slug: "microsoft-intune-endpoints",
    category: "cloud",
    categoryLabel: "Cloud & Hybrid Azure",
    difficulty: "Intermediate",
    description:
      "Manage zero-touch Windows Autopilot deployment, compliance policies, BitLocker encryption, and mobile device management (MDM).",
    detailedOverview:
      "Transition from legacy SCCM/MECM to cloud-native unified endpoint management with Microsoft Intune. Configure Windows Autopilot hardware hashes, conditional access, and Win32 app packaging.",
    modulesCount: 13,
    labsCount: 40,
    durationHours: 30,
    mentorsCount: 27,
    rating: 4.89,
    studentsEnrolled: 1450,
    tags: ["Intune", "Autopilot", "MDM", "Endpoint Manager", "BitLocker", "Compliance"],
    prerequisites: ["Active Directory and Entra ID basics"],
  },
  {
    id: "windows-incident-response",
    title: "Windows Digital Forensics & Incident Response (DFIR)",
    slug: "windows-dfir-forensics",
    category: "security",
    categoryLabel: "Security & Hardening",
    difficulty: "Advanced",
    description:
      "Analyze NTFS MFT records, registry hives, shimcache, amcache, and memory dumps (RAM) during active security breaches.",
    detailedOverview:
      "Step into the shoes of a lead incident responder. Extract artifact evidence from Prefetch, Volume Shadow Copies, Event Logs (Evtx), and Volatility memory analysis to reconstruct intrusion timelines.",
    modulesCount: 16,
    labsCount: 50,
    durationHours: 42,
    mentorsCount: 15,
    rating: 4.97,
    studentsEnrolled: 580,
    tags: ["DFIR", "Forensics", "Incident Response", "Memory Analysis", "NTFS", "Volatility"],
    prerequisites: ["Windows Internals & Security fundamentals"],
  },
];
