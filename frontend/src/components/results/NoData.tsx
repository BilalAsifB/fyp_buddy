import React from 'react';
import { Database, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

interface NoDataProps {
  onTryAgain: () => void;
}

const NoData: React.FC<NoDataProps> = ({ onTryAgain }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main No Data Card */}
      <Card variant="elevated" className="text-center">
        <CardContent className="py-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Database className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Student Profiles Available
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our system currently doesn't have any student profiles to match with. 
            This usually happens when the database is being updated or when the system is newly deployed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onTryAgain} variant="primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">When to Check Back</h3>
            </div>
            <p className="text-sm text-gray-600">
              Student profiles are typically added during enrollment periods. 
              Try checking back in a few hours or contact support for more information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-5 h-5 text-warning-600" />
              <h3 className="font-semibold text-gray-900">What This Means</h3>
            </div>
            <p className="text-sm text-gray-600">
              The matching system needs existing student profiles to find compatible partners. 
              Once profiles are available, you'll be able to find study buddies.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Alert */}
      <Alert variant="warning" title="System Status">
        The FYP matching system is operational, but no student data is currently available for matching. 
        This is typically a temporary situation that resolves as more students register their profiles.
      </Alert>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Need Immediate Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you need to find study partners urgently or have questions about the system, 
            you can reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@nu.edu.pk"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="tel:+92-21-1234567"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Call Helpdesk
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoData;