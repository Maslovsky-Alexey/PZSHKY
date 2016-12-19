using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ElectronicSchem.Models.ViewModels
{
    public class TagsComparer: IEqualityComparer<TagViewModel>
    {
        bool IEqualityComparer<TagViewModel>.Equals(TagViewModel obj1, TagViewModel obj2)
        {
            return obj1.value == obj2.value;
        }

        int IEqualityComparer<TagViewModel>.GetHashCode(TagViewModel obj1)
        {
            return obj1.GetHashCode();
        }
    }
}