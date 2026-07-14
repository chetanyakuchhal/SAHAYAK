import Link from "next/link";

const categoryConfig = {
  Medical: {
    gradient: "from-[#1B9B6E] to-[#22C37A]",
    badge: "bg-[#1B9B6E]/10 text-[#1B9B6E]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20s-6.5-3.9-8.6-7.1C1.3 10 2 6.6 4.9 5.5c2-.8 4.1.1 5.1 1.7 1-1.6 3.1-2.5 5.1-1.7 2.9 1.1 3.6 4.5 1.5 7.4C18.5 16.1 12 20 12 20z"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    badgeIcon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20s-6.5-3.9-8.6-7.1C1.3 10 2 6.6 4.9 5.5c2-.8 4.1.1 5.1 1.7 1-1.6 3.1-2.5 5.1-1.7 2.9 1.1 3.6 4.5 1.5 7.4C18.5 16.1 12 20 12 20z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
  },
  Education: {
    gradient: "from-[#5B7FD8] to-[#3BA5D8]",
    badge: "bg-[#5B7FD8]/10 text-[#5B7FD8]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 6h10a2 2 0 012 2v10H6a2 2 0 01-2-2V6z"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M16 8h4v10a2 2 0 01-2 2h-2" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
    ),
    badgeIcon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 6h10a2 2 0 012 2v10H6a2 2 0 01-2-2V6z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M16 8h4v10a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  Disaster: {
    gradient: "from-[#E8723A] to-[#F0A567]",
    badge: "bg-[#E8723A]/10 text-[#E8723A]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 13c2-3 5-3 7 0 2-3 5-3 7 0"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M3 16c3 3 6 3 9 0 3 3 6 3 9 0"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    badgeIcon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 13c2-3 5-3 7 0 2-3 5-3 7 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M3 16c3 3 6 3 9 0 3 3 6 3 9 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  Default: {
    gradient: "from-[#1B6B45] to-[#22C37A]",
    badge: "bg-[#22C37A]/10 text-[#22C37A]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l2.35 4.76L19.5 8.5l-3.75 3.65L16.6 17 12 14.6 7.4 17l.85-4.85L4.5 8.5l5.15-.74L12 3z"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    badgeIcon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l2.35 4.76L19.5 8.5l-3.75 3.65L16.6 17 12 14.6 7.4 17l.85-4.85L4.5 8.5l5.15-.74L12 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
  },
};

const FundraiserCard = ({
  title,
  description,
  category = "Medical",
  targetAmount = 0,
  raisedAmount = 0,
  coverImage,
  creatorName,
  _id,
}) => {
  const amountNeeded = Number(targetAmount || 0);
  const amountRaised = Number(raisedAmount || 0);
  const progress = amountNeeded > 0 ? Math.min((amountRaised / amountNeeded) * 100, 100) : 0;
  const styles = categoryConfig[category] || categoryConfig.Default;
  const paymentLink = _id ? `/payment?id=${_id}` : "/payment";
  const hasCoverImage = Boolean(coverImage);
  
  const safeCreatorName = creatorName || "Unknown";
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2EBE5] bg-white shadow-sm hover-lift card-hover">
      {hasCoverImage ? (
        <div className="h-28 w-full overflow-hidden">
          <img
            src={coverImage}
            alt={title || "Fundraiser cover"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className={`flex h-28 items-center justify-center bg-gradient-to-r ${styles.gradient}`}>
          {styles.icon}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${styles.badge}`}>
            {styles.badgeIcon}
            {category}
          </span>
        </div>
        <h3 className="mt-3 text-sm font-semibold text-[#1A1A1A] line-clamp-2">{title}</h3>
        <p className="mt-2 text-xs text-gray-600 line-clamp-2">
          {description || "Share the story behind your campaign."}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5F5F0] text-xs font-bold text-[#1B9B6E]">
            {getInitials(safeCreatorName)}
          </div>
          <span className="text-xs text-gray-700">
            by <span className="font-medium text-[#1A1A1A]">{safeCreatorName}</span>
          </span>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#22C37A] animate-pulse-subtle"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1A1A1A]">
              ₹{amountRaised.toLocaleString()} raised
            </span>
            <span className="text-gray-500">{progress.toFixed(1)}% of ₹{amountNeeded.toLocaleString()}</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">14 donors</p>
        </div>

        <Link
          href={paymentLink}
          className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#BEE86A] px-6 py-2.5 text-sm font-bold text-[#1A1A1A] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEE86A]/50 hover:opacity-90"
        >
          Donate now
        </Link>
      </div>
    </div>
  );
};

export default FundraiserCard;
