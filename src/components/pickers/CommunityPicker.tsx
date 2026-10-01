import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useT } from "@/hooks/useT";
import {
  COMMUNITY_SEARCH_MIN_LENGTH,
  searchLinkableCommunities,
  type LinkableCommunity,
} from "@/services/graphql/association/communitySearch";
import { SearchCombobox } from "./SearchCombobox";

export interface CommunityPickerProps {
  value: LinkableCommunity | null;
  onChange: (community: LinkableCommunity | null) => void;
  /** Communities already linked to this association — shown, but not selectable. */
  linkedIds?: ReadonlySet<string>;
  /** Communities with a link request still waiting — shown, but not selectable. */
  pendingIds?: ReadonlySet<string>;
  disabled?: boolean;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Pick a public community to request a link with, by name. Shows name, avatar
 * and member count; the community's id travels in the returned object and is
 * never displayed.
 */
export function CommunityPicker({ value, onChange, linkedIds, pendingIds, disabled }: CommunityPickerProps) {
  const t = useT();

  const renderCommunity = (community: LinkableCommunity) => (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        {community.avatarUrl && <AvatarImage src={community.avatarUrl} alt="" />}
        <AvatarFallback className="bg-primary/10 text-xs text-primary">
          {initials(community.name) || <Building2 className="h-4 w-4" aria-hidden="true" />}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">{community.name}</p>
        {community.memberCount != null && (
          <p className="truncate text-xs text-muted-foreground">
            {t.communityMembersCount.replace("{count}", String(community.memberCount))}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <SearchCombobox<LinkableCommunity>
      label={t.communityPickerLabel}
      placeholder={t.communityPickerPlaceholder}
      search={searchLinkableCommunities}
      getKey={(community) => community.id}
      getLabel={(community) => community.name}
      renderOption={renderCommunity}
      getDisabledReason={(community) =>
        linkedIds?.has(community.id)
          ? t.communityAlreadyLinked
          : pendingIds?.has(community.id)
            ? t.communityRequestPending
            : null
      }
      value={value}
      onChange={onChange}
      minLength={COMMUNITY_SEARCH_MIN_LENGTH}
      disabled={disabled}
      messages={{
        minChars: t.pickerMinChars.replace("{count}", String(COMMUNITY_SEARCH_MIN_LENGTH)),
        searching: t.pickerSearching,
        noResults: t.communityPickerNoResults,
        error: t.pickerError,
        results: (count) =>
          (count === 1 ? t.communityPickerResultsOne : t.communityPickerResultsOther).replace(
            "{count}",
            String(count),
          ),
        // Function replacer: a name containing "$&" must not be read as a replacement pattern.
        selected: (name) => t.pickerSelected.replace("{name}", () => name),
        clear: t.pickerClear,
      }}
    />
  );
}
