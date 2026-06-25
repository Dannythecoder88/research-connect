"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Building2,
  Bookmark,
  BookmarkCheck,
  Send,
  X,
  CheckCircle2,
  SlidersHorizontal,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/motion";
import {
  RESEARCH_CATEGORIES,
  COMMITMENT_TYPES,
  LOCATION_TYPES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

// Listing type matching database schema
type Listing = {
  id: string;
  title: string;
  organization: string;
  category: string;
  commitment: string;
  hours: string;
  location: string;
  posted: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  researchArea: string;
};

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedCommitments, setSelectedCommitments] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  // TODO: Replace with real Supabase query
  // useEffect(() => {
  //   const fetchListings = async () => {
  //     const supabase = createClient();
  //     const { data } = await supabase
  //       .from('research_listings')
  //       .select('*, researcher_profiles(lab_name)')
  //       .eq('status', 'active')
  //       .order('posted_at', { ascending: false });
  //     if (data) setListings(data);
  //   };
  //   fetchListings();
  // }, []);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApply = (id: string) => {
    setAppliedIds((prev) => new Set(prev).add(id));
    setShowApplySuccess(true);
    setTimeout(() => setShowApplySuccess(false), 3000);
  };

  const toggleFilter = (
    set: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch =
        !searchQuery ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.size === 0 || selectedCategories.has(listing.category);
      const matchesCommitment =
        selectedCommitments.size === 0 || selectedCommitments.has(listing.commitment);
      const matchesLocation =
        selectedLocations.size === 0 || selectedLocations.has(listing.location);
      return matchesSearch && matchesCategory && matchesCommitment && matchesLocation;
    });
  }, [listings, searchQuery, selectedCategories, selectedCommitments, selectedLocations]);

  const activeFilterCount =
    selectedCategories.size + selectedCommitments.size + selectedLocations.size;

  const getCategoryName = (id: string) =>
    RESEARCH_CATEGORIES.find((c) => c.id === id)?.name ?? id;
  const getCommitment = (id: string) =>
    COMMITMENT_TYPES.find((c) => c.id === id);
  const getLocation = (id: string) =>
    LOCATION_TYPES.find((l) => l.id === id);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          {RESEARCH_CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategories.has(cat.id)}
                onCheckedChange={() =>
                  toggleFilter(selectedCategories, setSelectedCategories, cat.id)
                }
              />
              <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-3">Commitment</h4>
        <div className="space-y-2">
          {COMMITMENT_TYPES.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`com-${type.id}`}
                checked={selectedCommitments.has(type.id)}
                onCheckedChange={() =>
                  toggleFilter(selectedCommitments, setSelectedCommitments, type.id)
                }
              />
              <Label htmlFor={`com-${type.id}`} className="text-sm cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-3">Location</h4>
        <div className="space-y-2">
          {LOCATION_TYPES.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`loc-${type.id}`}
                checked={selectedLocations.has(type.id)}
                onCheckedChange={() =>
                  toggleFilter(selectedLocations, setSelectedLocations, type.id)
                }
              />
              <Label htmlFor={`loc-${type.id}`} className="text-sm cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedCategories(new Set());
            setSelectedCommitments(new Set());
            setSelectedLocations(new Set());
          }}
          className="w-full text-muted-foreground"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and filter bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search positions, labs, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile filter button */}
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted lg:hidden h-11 w-11 relative">
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
              </SheetTrigger>
              <SheetContent side="left" className="w-72 pt-12">
                <h3 className="text-lg font-semibold mb-6">Filters</h3>
                <FilterPanel />
              </SheetContent>
            </Sheet>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredListings.length} opportunit{filteredListings.length === 1 ? "y" : "ies"} found
            </p>
            {activeFilterCount > 0 && (
              <div className="hidden lg:flex items-center gap-2">
                {Array.from(selectedCategories).map((id) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="text-xs cursor-pointer"
                    onClick={() =>
                      toggleFilter(selectedCategories, setSelectedCategories, id)
                    }
                  >
                    {getCategoryName(id)}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Main content: split layout */}
          <div className="flex gap-6">
            {/* Left sidebar: Filters (desktop) */}
            <div className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="text-xs h-5">
                      {activeFilterCount}
                    </Badge>
                  )}
                </h3>
                <FilterPanel />
              </div>
            </div>

            {/* Middle: Listing cards */}
            <div className="flex-1 lg:max-w-md">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-3 pr-2">
                  <AnimatePresence mode="popLayout">
                    {filteredListings.map((listing) => (
                      <motion.div
                        key={listing.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Use div instead of nested buttons to avoid hydration error */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedListing(listing);
                            setMobileDetailOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSelectedListing(listing);
                              setMobileDetailOpen(true);
                            }
                          }}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border transition-all cursor-pointer",
                            selectedListing?.id === listing.id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm truncate">
                                {listing.title}
                              </h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Building2 className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{listing.organization}</span>
                              </p>
                            </div>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaved(listing.id);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.stopPropagation();
                                  toggleSaved(listing.id);
                                }
                              }}
                              className="text-muted-foreground hover:text-primary transition-colors p-1 cursor-pointer"
                            >
                              {savedIds.has(listing.id) ? (
                                <BookmarkCheck className="h-4 w-4 text-primary" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px]",
                                getCommitment(listing.commitment)?.color
                              )}
                            >
                              {getCommitment(listing.commitment)?.label}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] bg-muted">
                              <MapPin className="h-2.5 w-2.5 mr-0.5" />
                              {getLocation(listing.location)?.label}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] bg-muted">
                              <Clock className="h-2.5 w-2.5 mr-0.5" />
                              {listing.hours} hrs
                            </Badge>
                          </div>

                          <p className="text-[11px] text-muted-foreground mt-2">
                            Posted {listing.posted}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredListings.length === 0 && (
                    <div className="text-center py-16">
                      <FlaskConical className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium mb-2">No opportunities yet</p>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        {listings.length === 0
                          ? "Research opportunities will appear here as labs and researchers post positions."
                          : "Try adjusting your search or filters."}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Right: Detail pane (desktop) */}
            <div className="hidden lg:block flex-1">
              <div className="sticky top-24">
                {selectedListing ? (
                  <DetailPane
                    listing={selectedListing}
                    isSaved={savedIds.has(selectedListing.id)}
                    isApplied={appliedIds.has(selectedListing.id)}
                    onToggleSave={() => toggleSaved(selectedListing.id)}
                    onApply={() => handleApply(selectedListing.id)}
                    showSuccess={showApplySuccess}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 rounded-xl border border-dashed border-border">
                    <FlaskConical className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Select an opportunity to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile detail sheet */}
        <Sheet open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl lg:hidden pt-6">
            <ScrollArea className="h-full pr-4">
              {selectedListing && (
                <DetailPane
                  listing={selectedListing}
                  isSaved={savedIds.has(selectedListing.id)}
                  isApplied={appliedIds.has(selectedListing.id)}
                  onToggleSave={() => toggleSaved(selectedListing.id)}
                  onApply={() => handleApply(selectedListing.id)}
                  showSuccess={showApplySuccess}
                />
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </PageTransition>
    </>
  );
}

function DetailPane({
  listing,
  isSaved,
  isApplied,
  onToggleSave,
  onApply,
  showSuccess,
}: {
  listing: Listing;
  isSaved: boolean;
  isApplied: boolean;
  onToggleSave: () => void;
  onApply: () => void;
  showSuccess: boolean;
}) {
  const commitment = COMMITMENT_TYPES.find((c) => c.id === listing.commitment);
  const location = LOCATION_TYPES.find((l) => l.id === listing.location);
  const category = RESEARCH_CATEGORIES.find((c) => c.id === listing.category);

  return (
    <motion.div
      key={listing.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">{listing.title}</h2>
        <p className="text-muted-foreground flex items-center gap-1.5">
          <Building2 className="h-4 w-4" />
          {listing.organization}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {commitment && (
          <Badge className={cn("text-xs", commitment.color)}>
            {commitment.label}
          </Badge>
        )}
        {location && (
          <Badge variant="secondary" className="text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {location.label}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {listing.hours} hrs/week
        </Badge>
        {category && (
          <Badge variant="secondary" className="text-xs">
            {category.name}
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        {isApplied ? (
          <Button disabled className="flex-1 h-10">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Applied
          </Button>
        ) : (
          <Button onClick={onApply} className="flex-1 h-10">
            <Send className="h-4 w-4 mr-2" />
            Easy Apply
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSave}
          className="h-10 w-10"
        >
          {isSaved ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-3 rounded-lg bg-emerald/10 border border-emerald/20 text-emerald text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            Application submitted! You&apos;ll hear back soon.
          </motion.div>
        )}
      </AnimatePresence>

      <Separator className="mb-6" />

      {/* Description */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {listing.description}
          </p>
        </div>

        {listing.responsibilities.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Responsibilities</h3>
            <ul className="space-y-1.5">
              {listing.responsibilities.map((r) => (
                <li
                  key={r}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {listing.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {listing.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {listing.researchArea && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Research Area</h3>
            <p className="text-sm text-muted-foreground">{listing.researchArea}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Posted {listing.posted}
        </p>
      </div>
    </motion.div>
  );
}
