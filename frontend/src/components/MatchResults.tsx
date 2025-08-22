import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { Match } from "../types";

interface MatchResultsProps {
  matches: Match[];
  error: string | null;
}

export default function MatchResults({ matches, error }: MatchResultsProps) {
  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
        No matches found yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
      {matches.map((match, index) => (
        <motion.div
          key={match.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-200">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">
                {match.title}
              </h3>
              <p className="text-sm text-gray-500">{match.domain}</p>
              <p className="text-gray-600 line-clamp-3">{match.idea}</p>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Tech Stack:</p>
                <div className="flex flex-wrap gap-2">
                  {match.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Interests:</p>
                <div className="flex flex-wrap gap-2">
                  {match.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded-full">
                  Score: {Math.round(match.score * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
